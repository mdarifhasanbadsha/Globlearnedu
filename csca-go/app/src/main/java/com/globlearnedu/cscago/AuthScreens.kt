package com.globlearnedu.cscago

import androidx.activity.compose.BackHandler
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Email
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.School
import androidx.compose.material.icons.filled.VerifiedUser
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Checkbox
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.platform.LocalContext
import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.launch

private val AuthNavy = Color(0xFF172A46)
private val AuthRed = Color(0xFFC8102E)
private val AuthCanvas = Color(0xFFF5F7FB)
private val AuthMuted = Color(0xFF697A91)

@Composable
fun AuthScreen(onAuthenticated: (String, MobileUser) -> Unit) {
    val scope = rememberCoroutineScope()
    var screen by remember { mutableStateOf("login") }
    var loading by remember { mutableStateOf(false) }
    var error by remember { mutableStateOf<String?>(null) }
    var notice by remember { mutableStateOf<String?>(null) }

    var identifier by remember { mutableStateOf("") }
    var loginPassword by remember { mutableStateOf("") }
    var firstName by remember { mutableStateOf("") }
    var lastName by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var phone by remember { mutableStateOf("") }
    var country by remember { mutableStateOf("Bangladesh") }
    var signupPassword by remember { mutableStateOf("") }
    var confirmPassword by remember { mutableStateOf("") }
    var otp by remember { mutableStateOf("") }
    var showPassword by remember { mutableStateOf(false) }
    var acceptedTerms by remember { mutableStateOf(false) }
    val context = LocalContext.current

    BackHandler(enabled = screen != "login") {
        when (screen) {
            "otp" -> { screen = "signup"; otp = ""; error = null; notice = null }
            "signup" -> { screen = "login"; error = null; notice = null }
        }
    }

    fun requestCode() {
        error = null
        notice = null
        if (firstName.trim().isEmpty() || lastName.trim().isEmpty() || email.trim().isEmpty() ||
            phone.trim().isEmpty() || country.trim().isEmpty() || signupPassword.isEmpty()) {
            error = "Complete every field before requesting the verification code."
            return
        }
        if (!acceptedTerms) {
            error = "Please accept the Terms of Service and Privacy Policy to create an account."
            return
        }
        if (signupPassword != confirmPassword) {
            error = "Your passwords do not match."
            return
        }
        loading = true
        scope.launch {
            try {
                MobileAuthApi.requestOtp(firstName, lastName, email, phone, country, signupPassword, acceptedTerms)
                screen = "otp"
                notice = "A six-digit verification code has been sent to ${email.trim()}."
            } catch (e: Exception) {
                error = e.message ?: "We couldn't send the verification code."
            } finally {
                loading = false
            }
        }
    }

    Box(
        Modifier.fillMaxSize().background(
            Brush.verticalGradient(listOf(Color(0xFFFFF7F8), AuthCanvas, Color.White))
        ),
        contentAlignment = Alignment.Center
    ) {
        Column(
            Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(horizontal = 22.dp, vertical = 26.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Surface(color = AuthRed, shape = RoundedCornerShape(20.dp), modifier = Modifier.size(66.dp)) {
                Box(contentAlignment = Alignment.Center) {
                    Icon(Icons.Default.School, contentDescription = "CSCA Go", tint = Color.White, modifier = Modifier.size(34.dp))
                }
            }
            Spacer(Modifier.height(13.dp))
            Text("CSCA GO", color = AuthRed, fontSize = 12.sp, fontWeight = FontWeight.ExtraBold, letterSpacing = 2.2.sp)
            Text("Your study journey starts here", color = AuthNavy, fontSize = 22.sp, fontWeight = FontWeight.Bold)
            Text("Student learning · Mock tests · CSCA resources", color = AuthMuted, fontSize = 12.sp)
            Spacer(Modifier.height(22.dp))

            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                shape = RoundedCornerShape(25.dp),
                elevation = CardDefaults.cardElevation(defaultElevation = 3.dp)
            ) {
                Column(Modifier.fillMaxWidth().padding(21.dp), verticalArrangement = Arrangement.spacedBy(13.dp)) {
                    if (screen == "login") {
                        Text("Welcome back", color = AuthNavy, fontSize = 23.sp, fontWeight = FontWeight.Bold)
                        Text("Sign in with your website account.", color = AuthMuted, fontSize = 13.sp)
                        OutlinedTextField(
                            value = identifier, onValueChange = { identifier = it; error = null },
                            modifier = Modifier.fillMaxWidth(), singleLine = true,
                            label = { Text("Email or phone number") },
                            placeholder = { Text("you@example.com or +880…") },
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Text)
                        )
                        OutlinedTextField(
                            value = loginPassword, onValueChange = { loginPassword = it; error = null },
                            modifier = Modifier.fillMaxWidth(), singleLine = true,
                            label = { Text("Password") },
                            visualTransformation = if (showPassword) VisualTransformation.None else PasswordVisualTransformation(),
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                            trailingIcon = {
                                TextButton(onClick = { showPassword = !showPassword }) { Text(if (showPassword) "Hide" else "Show", color = AuthRed) }
                            }
                        )
                        if (error != null) AuthMessage(error!!, false)
                        Button(
                            onClick = {
                                if (identifier.trim().isEmpty() || loginPassword.isEmpty()) {
                                    error = "Enter your email or phone number and password."
                                } else {
                                    loading = true
                                    error = null
                                    scope.launch {
                                        try {
                                            val result = MobileAuthApi.login(identifier, loginPassword)
                                            onAuthenticated(result.accessToken, result.user)
                                        } catch (e: Exception) {
                                            error = e.message ?: "Sign in failed."
                                        } finally {
                                            loading = false
                                        }
                                    }
                                }
                            },
                            enabled = !loading,
                            modifier = Modifier.fillMaxWidth().height(50.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = AuthRed),
                            shape = RoundedCornerShape(14.dp)
                        ) { AuthButtonLabel(if (loading) "Signing in…" else "Sign in") }
                        TextButton(onClick = { screen = "signup"; error = null; notice = null }, modifier = Modifier.fillMaxWidth()) {
                            Text("New to CSCA Go? Create student account", color = AuthRed, fontWeight = FontWeight.SemiBold)
                        }
                        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.End) {
                            TextButton(onClick = {
                                try {
                                    context.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse("https://globlearnedu.com/forgot-password")))
                                } catch (_: Exception) {
                                    error = "Open globlearnedu.com/forgot-password in your browser to reset your password."
                                }
                            }) { Text("Forgot password?", color = AuthRed, fontSize = 12.sp) }
                        }
                        Text("Your website student account is used. Login does not require an OTP each time.", color = AuthMuted, fontSize = 11.sp, lineHeight = 16.sp)
                    } else if (screen == "signup") {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            TextButton(onClick = { screen = "login"; error = null; notice = null }) {
                                Icon(Icons.Default.ArrowBack, null, tint = AuthRed)
                                Spacer(Modifier.width(5.dp))
                                Text("Sign in", color = AuthRed)
                            }
                            Spacer(Modifier.weight(1f))
                            Icon(Icons.Default.Person, null, tint = AuthRed)
                        }
                        Text("Create student account", color = AuthNavy, fontSize = 22.sp, fontWeight = FontWeight.Bold)
                        Text("Verify your email once; then sign in with your password.", color = AuthMuted, fontSize = 12.sp)
                        Row(horizontalArrangement = Arrangement.spacedBy(9.dp)) {
                            OutlinedTextField(firstName, { firstName = it; error = null }, modifier = Modifier.weight(1f), singleLine = true, label = { Text("First name") })
                            OutlinedTextField(lastName, { lastName = it; error = null }, modifier = Modifier.weight(1f), singleLine = true, label = { Text("Last name") })
                        }
                        OutlinedTextField(email, { email = it; error = null }, modifier = Modifier.fillMaxWidth(), singleLine = true, label = { Text("Email address") }, keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email))
                        OutlinedTextField(phone, { phone = it; error = null }, modifier = Modifier.fillMaxWidth(), singleLine = true, label = { Text("Phone number (include country code)") }, placeholder = { Text("+8801XXXXXXXXX") }, keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone))
                        OutlinedTextField(country, { country = it; error = null }, modifier = Modifier.fillMaxWidth(), singleLine = true, label = { Text("Country") })
                        OutlinedTextField(
                            signupPassword, { signupPassword = it; error = null }, modifier = Modifier.fillMaxWidth(), singleLine = true,
                            label = { Text("Set password") }, visualTransformation = PasswordVisualTransformation(),
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                            supportingText = { Text("At least 8 characters, one uppercase letter and one number.") }
                        )
                        OutlinedTextField(
                            confirmPassword, { confirmPassword = it; error = null }, modifier = Modifier.fillMaxWidth(), singleLine = true,
                            label = { Text("Confirm password") }, visualTransformation = PasswordVisualTransformation(),
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password)
                        )
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Checkbox(checked = acceptedTerms, onCheckedChange = { acceptedTerms = it; error = null })
                            Column(Modifier.weight(1f)) {
                                Text("I accept the Terms of Service and Privacy Policy", color = AuthNavy, fontSize = 12.sp, fontWeight = FontWeight.Medium)
                                Text("Required to create a CSCA Go account.", color = AuthMuted, fontSize = 10.sp)
                            }
                        }
                        if (error != null) AuthMessage(error!!, false)
                        Button(
                            onClick = { requestCode() },
                            enabled = !loading,
                            modifier = Modifier.fillMaxWidth().height(50.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = AuthRed),
                            shape = RoundedCornerShape(14.dp)
                        ) { AuthButtonLabel(if (loading) "Sending code…" else "Send email verification code") }
                        Text("Your phone number is used as an account identifier; no phone OTP is sent.", color = AuthMuted, fontSize = 11.sp, lineHeight = 16.sp)
                    } else {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            TextButton(onClick = { screen = "signup"; error = null; notice = null }) {
                                Icon(Icons.Default.ArrowBack, null, tint = AuthRed)
                                Spacer(Modifier.width(5.dp))
                                Text("Edit details", color = AuthRed)
                            }
                            Spacer(Modifier.weight(1f))
                            Icon(Icons.Default.VerifiedUser, null, tint = AuthRed)
                        }
                        Text("Verify your email", color = AuthNavy, fontSize = 23.sp, fontWeight = FontWeight.Bold)
                        Text("Enter the six-digit code sent to ${email.trim()}. It expires after 10 minutes.", color = AuthMuted, fontSize = 12.sp, lineHeight = 18.sp)
                        OutlinedTextField(
                            value = otp, onValueChange = { value -> otp = value.filter(Char::isDigit).take(6); error = null },
                            modifier = Modifier.fillMaxWidth(), singleLine = true,
                            label = { Text("6-digit email code") }, placeholder = { Text("000000") },
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number)
                        )
                        if (notice != null) AuthMessage(notice!!, true)
                        if (error != null) AuthMessage(error!!, false)
                        Button(
                            onClick = {
                                if (otp.length != 6) {
                                    error = "Enter the full six-digit code."
                                } else {
                                    loading = true
                                    error = null
                                    scope.launch {
                                        try {
                                            val result = MobileAuthApi.verifyOtp(email, otp)
                                            onAuthenticated(result.accessToken, result.user)
                                        } catch (e: Exception) {
                                            error = e.message ?: "Email verification failed."
                                        } finally {
                                            loading = false
                                        }
                                    }
                                }
                            },
                            enabled = !loading,
                            modifier = Modifier.fillMaxWidth().height(50.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = AuthRed),
                            shape = RoundedCornerShape(14.dp)
                        ) { AuthButtonLabel(if (loading) "Verifying…" else "Verify email and create account") }
                        OutlinedButton(onClick = { otp = ""; requestCode() }, enabled = !loading, modifier = Modifier.fillMaxWidth()) {
                            Text("Send a new code", color = AuthRed)
                        }
                        Text("For security, incorrect attempts are limited. A new code can be requested after the resend cooldown.", color = AuthMuted, fontSize = 11.sp, lineHeight = 16.sp)
                    }
                }
            }
            Spacer(Modifier.height(18.dp))
            Text("by GL Education", color = AuthMuted, fontSize = 12.sp, fontWeight = FontWeight.Medium)
        }
    }
}

@Composable
private fun AuthMessage(message: String, success: Boolean) {
    val color = if (success) Color(0xFF176B55) else Color(0xFFAD2036)
    val background = if (success) Color(0xFFE8F7F1) else Color(0xFFFFEEF0)
    Surface(color = background, shape = RoundedCornerShape(11.dp), modifier = Modifier.fillMaxWidth()) {
        Text(message, color = color, fontSize = 12.sp, lineHeight = 17.sp, modifier = Modifier.padding(11.dp))
    }
}

@Composable
private fun AuthButtonLabel(label: String) {
    if (label.endsWith("…")) {
        CircularProgressIndicator(modifier = Modifier.size(17.dp), color = Color.White, strokeWidth = 2.dp)
        Spacer(Modifier.width(9.dp))
    }
    Text(label, fontWeight = FontWeight.Bold)
}
