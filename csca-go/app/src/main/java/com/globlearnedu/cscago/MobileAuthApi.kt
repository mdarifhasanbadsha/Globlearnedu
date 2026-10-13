package com.globlearnedu.cscago

import android.content.Context
import android.net.Uri
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKey
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL

data class MobileUser(
    val id: String,
    val email: String,
    val firstName: String,
    val lastName: String,
    val name: String,
    val phone: String,
    val country: String,
    val image: String?,
    val emailVerified: Boolean,
    val role: String
) {
    companion object {
        fun fromJson(json: JSONObject): MobileUser = MobileUser(
            id = json.optString("id"),
            email = json.optString("email"),
            firstName = json.optString("firstName"),
            lastName = json.optString("lastName"),
            name = json.optString("name"),
            phone = json.optString("phone"),
            country = json.optString("country"),
            image = json.optString("image").takeIf { it.isNotBlank() && it != "null" },
            emailVerified = json.optBoolean("emailVerified", false),
            role = json.optString("role", "student")
        )
    }
}

data class AuthResult(val accessToken: String, val user: MobileUser)

object SessionStore {
    private const val PREFS = "csca_go_secure_session"
    private const val TOKEN_KEY = "access_token"

    private fun prefs(context: Context) = EncryptedSharedPreferences.create(
        context,
        PREFS,
        MasterKey.Builder(context).setKeyScheme(MasterKey.KeyScheme.AES256_GCM).build(),
        EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
        EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
    )

    fun read(context: Context): String? = try { prefs(context).getString(TOKEN_KEY, null) } catch (_: Exception) { null }

    fun save(context: Context, token: String) {
        prefs(context).edit().putString(TOKEN_KEY, token).apply()
    }

    fun clear(context: Context) {
        try { prefs(context).edit().remove(TOKEN_KEY).apply() } catch (_: Exception) {}
    }
}

object MobileAuthApi {
    private const val ENDPOINT = "https://globlearnedu.com/api/csca-go/auth"

    suspend fun requestOtp(
        firstName: String,
        lastName: String,
        email: String,
        phone: String,
        country: String,
        password: String,
        acceptedTerms: Boolean
    ): JSONObject = post(JSONObject()
        .put("action", "requestOtp")
        .put("firstName", firstName.trim())
        .put("lastName", lastName.trim())
        .put("email", email.trim().lowercase())
        .put("phone", phone.trim())
        .put("country", country.trim())
        .put("password", password)
        .put("acceptedTerms", acceptedTerms)
    )

    suspend fun verifyOtp(email: String, otp: String): AuthResult {
        val response = post(JSONObject().put("action", "verifyOtp").put("email", email.trim().lowercase()).put("otp", otp.trim()))
        return AuthResult(response.getString("accessToken"), MobileUser.fromJson(response.getJSONObject("user")))
    }

    suspend fun login(identifier: String, password: String): AuthResult {
        val response = post(JSONObject().put("action", "login").put("identifier", identifier.trim()).put("password", password))
        return AuthResult(response.getString("accessToken"), MobileUser.fromJson(response.getJSONObject("user")))
    }

    suspend fun me(token: String): MobileUser = withContext(Dispatchers.IO) {
        val response = request("GET", null, token)
        MobileUser.fromJson(response.getJSONObject("user"))
    }


    suspend fun updateDisplayName(token: String, displayName: String): MobileUser = withContext(Dispatchers.IO) {
        val payload = JSONObject().put("displayName", displayName.trim())
        val connection = (URL("https://globlearnedu.com/api/csca-go/profile").openConnection() as HttpURLConnection).apply {
            requestMethod = "POST"
            connectTimeout = 15000
            readTimeout = 20000
            doOutput = true
            setRequestProperty("Authorization", "Bearer $token")
            setRequestProperty("Content-Type", "application/json; charset=utf-8")
            setRequestProperty("Accept", "application/json")
            setRequestProperty("Cache-Control", "no-store")
        }
        try {
            connection.outputStream.use { it.write(payload.toString().toByteArray(Charsets.UTF_8)) }
            val status = connection.responseCode
            val stream = if (status in 200..299) connection.inputStream else connection.errorStream
            val body = stream?.bufferedReader()?.use { it.readText() }.orEmpty()
            val result = if (body.isBlank()) JSONObject() else JSONObject(body)
            if (status !in 200..299) throw IllegalStateException(result.optString("error", "Could not save your display name."))
            MobileUser.fromJson(result.getJSONObject("user"))
        } finally {
            connection.disconnect()
        }
    }

    suspend fun uploadProfilePhoto(context: Context, token: String, uri: Uri): MobileUser = withContext(Dispatchers.IO) {
        val type = context.contentResolver.getType(uri)?.lowercase()
            ?: throw IllegalStateException("Could not identify this image. Choose a JPG, PNG or WebP file.")
        if (type !in setOf("image/jpeg", "image/png", "image/webp")) {
            throw IllegalStateException("Choose a JPG, PNG or WebP image.")
        }
        val bytes = context.contentResolver.openInputStream(uri)?.use { it.readBytes() }
            ?: throw IllegalStateException("Could not read the selected image.")
        if (bytes.isEmpty() || bytes.size > 3 * 1024 * 1024) {
            throw IllegalStateException("Profile images must be 3 MB or smaller.")
        }
        val extension = when (type) { "image/jpeg" -> "jpg"; "image/png" -> "png"; else -> "webp" }
        val boundary = "CSCAgoBoundary" + System.currentTimeMillis().toString()
        val head = "--$boundary\r\n" +
            "Content-Disposition: form-data; name=\"avatar\"; filename=\"profile.$extension\"\r\n" +
            "Content-Type: $type\r\n\r\n"
        val tail = "\r\n--$boundary--\r\n"
        val payload = head.toByteArray(Charsets.UTF_8) + bytes + tail.toByteArray(Charsets.UTF_8)
        val connection = (URL("https://globlearnedu.com/api/csca-go/profile").openConnection() as HttpURLConnection).apply {
            requestMethod = "PUT"
            connectTimeout = 20000
            readTimeout = 30000
            doOutput = true
            setRequestProperty("Authorization", "Bearer $token")
            setRequestProperty("Content-Type", "multipart/form-data; boundary=$boundary")
            setRequestProperty("Accept", "application/json")
            setRequestProperty("Cache-Control", "no-store")
        }
        try {
            connection.outputStream.use { it.write(payload) }
            val status = connection.responseCode
            val stream = if (status in 200..299) connection.inputStream else connection.errorStream
            val body = stream?.bufferedReader()?.use { it.readText() }.orEmpty()
            val result = if (body.isBlank()) JSONObject() else JSONObject(body)
            if (status !in 200..299) throw IllegalStateException(result.optString("error", "Could not upload your profile image."))
            MobileUser.fromJson(result.getJSONObject("user"))
        } finally {
            connection.disconnect()
        }
    }

    suspend fun logout(token: String) {
        try { post(JSONObject().put("action", "logout"), token) } catch (_: Exception) { }
    }

    private suspend fun post(payload: JSONObject, bearer: String? = null): JSONObject =
        withContext(Dispatchers.IO) { request("POST", payload, bearer) }

    private fun request(method: String, payload: JSONObject?, bearer: String?): JSONObject {
        val connection = (URL(ENDPOINT).openConnection() as HttpURLConnection).apply {
            requestMethod = method
            connectTimeout = 15000
            readTimeout = 20000
            setRequestProperty("Accept", "application/json")
            setRequestProperty("Cache-Control", "no-store")
            if (bearer != null) setRequestProperty("Authorization", "Bearer $bearer")
            if (payload != null) {
                doOutput = true
                setRequestProperty("Content-Type", "application/json; charset=utf-8")
            }
        }
        try {
            if (payload != null) {
                connection.outputStream.use { it.write(payload.toString().toByteArray(Charsets.UTF_8)) }
            }
            val status = connection.responseCode
            val stream = if (status in 200..299) connection.inputStream else connection.errorStream
            val body = stream?.bufferedReader()?.use { it.readText() }.orEmpty()
            val result = if (body.isBlank()) JSONObject() else JSONObject(body)
            if (status !in 200..299) {
                throw IllegalStateException(result.optString("error").ifBlank { "Request failed (HTTP $status). Please try again." })
            }
            return result
        } catch (e: IllegalStateException) {
            throw e
        } catch (e: Exception) {
            throw IllegalStateException("Unable to contact GL Education. Check your internet connection and try again.", e)
        } finally {
            connection.disconnect()
        }
    }
}
