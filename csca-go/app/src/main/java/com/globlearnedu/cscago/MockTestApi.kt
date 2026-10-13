package com.globlearnedu.cscago

import org.json.JSONArray
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL
import java.time.Instant
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

data class PublicQuestion(
    val prompt: String,
    val options: List<String>,
    val marks: Double
)

data class PublicMockExam(
    val subject: String,
    val testNumber: Int,
    val title: String,
    val durationMinutes: Int,
    val totalMarks: Double,
    val questionCount: Int,
    val instructions: List<String>,
    val questions: List<PublicQuestion>
)

data class PublicMockSummary(
    val subject: String,
    val testNumber: Int,
    val title: String,
    val durationMinutes: Int,
    val totalMarks: Double,
    val questionCount: Int
)

data class PriorMockAttempt(
    val taken: Boolean,
    val candidateName: String = "",
    val score: Double = 0.0,
    val totalMarks: Double = 0.0,
    val awayCount: Int = 0,
    val token: String = ""
)

data class MockCandidate(
    val name: String,
    val phone: String,
    val email: String
)

object MockTestApi {
    suspend fun loadAvailability(): List<PublicMockSummary> = withContext(Dispatchers.IO) {
        val url = URL("${ApiConfig.WEBSITE_BASE_URL}/api/csca/mocktest?availability=1")
        val connection = (url.openConnection() as HttpURLConnection).apply {
            requestMethod = "GET"
            connectTimeout = 12000
            readTimeout = 20000
            setRequestProperty("Accept", "application/json")
            setRequestProperty("Cache-Control", "no-cache")
        }
        try {
            val status = connection.responseCode
            val stream = if (status in 200..299) connection.inputStream else connection.errorStream
            val body = stream?.bufferedReader()?.use { it.readText() }.orEmpty()
            if (status !in 200..299) throw IllegalStateException("Unable to load available mock tests (HTTP $status).")
            val root = JSONObject(body)
            val array = root.optJSONArray("tests") ?: JSONArray()
            buildList {
                for (i in 0 until array.length()) {
                    val item = array.getJSONObject(i)
                    add(PublicMockSummary(
                        subject = item.optString("subject"),
                        testNumber = item.optInt("testNumber"),
                        title = item.optString("title"),
                        durationMinutes = item.optInt("durationMinutes"),
                        totalMarks = item.optDouble("totalMarks"),
                        questionCount = item.optInt("questionCount")
                    ))
                }
            }
        } finally {
            connection.disconnect()
        }
    }

    suspend fun checkPreviousAttempt(subject: String, testNumber: Int, phone: String, email: String): PriorMockAttempt =
        withContext(Dispatchers.IO) {
            val query = "action=existing&subject=" + java.net.URLEncoder.encode(subject, "UTF-8") +
                "&test=" + testNumber +
                "&phone=" + java.net.URLEncoder.encode(phone, "UTF-8") +
                "&email=" + java.net.URLEncoder.encode(email, "UTF-8")
            val url = URL("${ApiConfig.WEBSITE_BASE_URL}/api/csca/mocktest?${query}")
            val connection = (url.openConnection() as HttpURLConnection).apply {
                requestMethod = "GET"
                connectTimeout = 12000
                readTimeout = 20000
                setRequestProperty("Accept", "application/json")
                setRequestProperty("Cache-Control", "no-cache")
            }
            try {
                val status = connection.responseCode
                val stream = if (status in 200..299) connection.inputStream else connection.errorStream
                val body = stream?.bufferedReader()?.use { it.readText() }.orEmpty()
                val result = if (body.isBlank()) JSONObject() else JSONObject(body)
                if (status !in 200..299) throw IllegalStateException(result.optString("error", "Unable to check your earlier attempt."))
                PriorMockAttempt(
                    taken = result.optBoolean("taken", false),
                    candidateName = result.optString("candidate_name"),
                    score = result.optDouble("score", 0.0),
                    totalMarks = result.optDouble("total_marks", 0.0),
                    awayCount = result.optInt("away_count", 0),
                    token = result.optString("token")
                )
            } finally {
                connection.disconnect()
            }
        }

    suspend fun loadExam(subject: String, testNumber: Int): PublicMockExam? = withContext(Dispatchers.IO) {
        val url = URL("${ApiConfig.WEBSITE_BASE_URL}/api/csca/mocktest?exam=1&subject=$subject&test=$testNumber")
        val connection = (url.openConnection() as HttpURLConnection).apply {
            requestMethod = "GET"
            connectTimeout = 12000
            readTimeout = 20000
            setRequestProperty("Accept", "application/json")
            setRequestProperty("Cache-Control", "no-cache")
        }
        try {
            val status = connection.responseCode
            val stream = if (status in 200..299) connection.inputStream else connection.errorStream
            val body = stream?.bufferedReader()?.use { it.readText() }.orEmpty()
            if (status == 404) return@withContext null
            if (status !in 200..299) throw IllegalStateException("Unable to load this test (HTTP $status).")
            val root = JSONObject(body)
            if (!root.optBoolean("released", false)) return@withContext null
            val exam = root.getJSONObject("exam")
            val questionArray = exam.getJSONArray("questions")
            val questions = buildList {
                for (i in 0 until questionArray.length()) {
                    val q = questionArray.getJSONObject(i)
                    val optionArray = q.optJSONArray("options") ?: JSONArray()
                    val options = buildList {
                        for (j in 0 until optionArray.length()) add(optionArray.optString(j, ""))
                    }
                    add(PublicQuestion(
                        prompt = q.optString("prompt", "Question ${i + 1}"),
                        options = options,
                        marks = q.optDouble("marks", 1.0)
                    ))
                }
            }
            PublicMockExam(
                subject = exam.optString("subject", subject),
                testNumber = exam.optInt("testNumber", testNumber),
                title = exam.optString("title", "${subject.replaceFirstChar { it.uppercase() }} Mock Test $testNumber"),
                durationMinutes = exam.optInt("durationMinutes", 60),
                totalMarks = exam.optDouble("totalMarks", questions.sumOf { it.marks }),
                questionCount = exam.optInt("questionCount", questions.size),
                instructions = exam.optJSONArray("instructions")?.let { array ->
                    buildList { for (i in 0 until array.length()) add(array.optString(i, "")) }
                }?.filter { it.isNotBlank() } ?: listOf("Choose the best answer for each question."),
                questions = questions
            )
        } finally {
            connection.disconnect()
        }
    }

    suspend fun submit(
        exam: PublicMockExam,
        candidate: MockCandidate,
        answers: List<Int>,
        awayCount: Int,
        startedAt: String
    ): JSONObject = withContext(Dispatchers.IO) {
        val url = URL("${ApiConfig.WEBSITE_BASE_URL}/api/csca/mocktest")
        val payload = JSONObject()
            .put("action", "submit")
            .put("subject", exam.subject)
            .put("testNumber", exam.testNumber)
            .put("name", candidate.name)
            .put("phone", candidate.phone)
            .put("email", candidate.email)
            .put("countryIso", "")
            .put("answers", JSONArray(answers))
            .put("awayCount", awayCount.coerceIn(0, 1000))
            .put("startedAt", startedAt.ifBlank { Instant.now().toString() })

        val connection = (url.openConnection() as HttpURLConnection).apply {
            requestMethod = "POST"
            connectTimeout = 15000
            readTimeout = 25000
            doOutput = true
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
            if (status !in 200..299 || !result.optBoolean("submitted", false)) {
                throw IllegalStateException(result.optString("error", "The result could not be submitted. Please try again."))
            }
            result
        } finally {
            connection.disconnect()
        }
    }
}
