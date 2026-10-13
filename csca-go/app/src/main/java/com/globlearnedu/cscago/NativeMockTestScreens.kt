package com.globlearnedu.cscago

import android.content.Intent
import android.net.Uri
import androidx.activity.compose.BackHandler
import androidx.activity.ComponentActivity
import android.view.WindowManager
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleEventObserver
import androidx.lifecycle.compose.LocalLifecycleOwner
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.SideEffect
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.ArrowForward
import androidx.compose.material.icons.filled.Assignment
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.FactCheck
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Science
import androidx.compose.material.icons.filled.Timer
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import org.json.JSONObject
import java.time.Instant

private val MT_RED = Color(0xFFC8102E)
private val MT_NAVY = Color(0xFF172A46)
private val MT_BLUE = Color(0xFF2E67B1)
private val MT_BG = Color(0xFFF5F7FB)
private val MT_MUTED = Color(0xFF697A91)

@Composable
fun ConnectedTestsScreen(
    user: MobileUser,
    onStartExam: (PublicMockExam, MockCandidate) -> Unit,
    onExamGuide: () -> Unit,
    onInfo: (String) -> Unit
) {
    val scope = rememberCoroutineScope()
    val context = LocalContext.current
    var tests by remember { mutableStateOf<List<PublicMockSummary>>(emptyList()) }
    var loading by remember { mutableStateOf(true) }
    var loadError by remember { mutableStateOf<String?>(null) }
    var opening by remember { mutableStateOf<String?>(null) }
    var fullName by remember(user.id) { mutableStateOf(user.name.ifBlank { user.firstName }) }
    var phone by remember(user.id) { mutableStateOf(user.phone) }
    var email by remember(user.id) { mutableStateOf(user.email) }
    var formError by remember { mutableStateOf<String?>(null) }
    var repeatExam by remember { mutableStateOf<PublicMockExam?>(null) }
    var repeatCandidate by remember { mutableStateOf<MockCandidate?>(null) }
    var previous by remember { mutableStateOf<PriorMockAttempt?>(null) }
    var showPrevious by remember { mutableStateOf(false) }

    suspend fun loadTests() {
        loading = true
        loadError = null
        try { tests = MockTestApi.loadAvailability() }
        catch (e: Exception) { loadError = e.message ?: "Could not load tests from GL Education." }
        finally { loading = false }
    }
    LaunchedEffect(Unit) { loadTests() }

    fun begin(summary: PublicMockSummary) {
        formError = null
        val name = fullName.trim()
        val mail = email.trim().lowercase()
        if (name.isBlank()) { formError = "Enter your full name."; return }
        if (phone.filter(Char::isDigit).length !in 7..15) {
            formError = "Enter a valid phone number including country code. It is used to save your result in the existing website system."
            return
        }
        if (!Regex("^[^\\s@]+@[^\\s@]+\\.[A-Za-z]{2,}$").matches(mail)) {
            formError = "Enter a valid email address."
            return
        }
        val candidate = MockCandidate(name, phone.trim(), mail)
        val key = "${summary.subject}-${summary.testNumber}"
        opening = key
        scope.launch {
            try {
                val exam = MockTestApi.loadExam(summary.subject, summary.testNumber)
                    ?: throw IllegalStateException("This test is no longer released. Refresh the test list.")
                val prior = MockTestApi.checkPreviousAttempt(summary.subject, summary.testNumber, candidate.phone, candidate.email)
                if (prior.taken) {
                    repeatExam = exam
                    repeatCandidate = candidate
                    previous = prior
                    showPrevious = true
                } else onStartExam(exam, candidate)
            } catch (e: Exception) {
                formError = e.message ?: "Unable to open this test. Please try again."
            } finally { opening = null }
        }
    }

    LazyColumn(
        Modifier.fillMaxSize().background(MT_BG),
        contentPadding = PaddingValues(18.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        item {
            Text("Mock Tests", color = MT_NAVY, fontSize = 28.sp, fontWeight = FontWeight.Bold)
            Text("Uses released question sets and score submission from the existing GL Education website.", color = MT_MUTED, fontSize = 13.sp, lineHeight = 18.sp)
        }
        item {
            Card(colors = CardDefaults.cardColors(containerColor = MT_NAVY), shape = RoundedCornerShape(22.dp)) {
                Column(Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(9.dp)) {
                    Text("PRACTICE EXAM MODE", color = Color(0xFFFFB8C3), fontWeight = FontWeight.ExtraBold, fontSize = 10.sp, letterSpacing = 1.4.sp)
                    Text("Take a timed mock test", color = Color.White, fontSize = 20.sp, fontWeight = FontWeight.Bold)
                    Text("Questions load from the current server question bank. The server calculates and records the result.", color = Color(0xFFD5E3F6), fontSize = 12.sp, lineHeight = 18.sp)
                    Button(onClick = onExamGuide, colors = ButtonDefaults.buttonColors(containerColor = MT_RED)) { Text("Read exam guide") }
                }
            }
        }
        item {
            Card(colors = CardDefaults.cardColors(containerColor = Color.White), shape = RoundedCornerShape(18.dp), border = BorderStroke(1.dp, Color(0xFFE4EAF3))) {
                Column(Modifier.padding(15.dp), verticalArrangement = Arrangement.spacedBy(9.dp)) {
                    Text("Candidate details", color = MT_NAVY, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                    Text("Pre-filled from your account; used by the website to identify your attempt.", color = MT_MUTED, fontSize = 11.sp)
                    OutlinedTextField(fullName, { fullName = it; formError = null }, modifier = Modifier.fillMaxWidth(), label = { Text("Full name") }, singleLine = true)
                    OutlinedTextField(phone, { phone = it; formError = null }, modifier = Modifier.fillMaxWidth(), label = { Text("Phone (include country code)") }, singleLine = true)
                    OutlinedTextField(email, { email = it; formError = null }, modifier = Modifier.fillMaxWidth(), label = { Text("Email address") }, singleLine = true)
                    if (formError != null) Text(formError!!, color = MT_RED, fontSize = 12.sp, lineHeight = 17.sp)
                }
            }
        }
        item {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text("Released tests", color = MT_NAVY, fontWeight = FontWeight.Bold, fontSize = 19.sp, modifier = Modifier.weight(1f))
                TextButton(onClick = { scope.launch { loadTests() } }, enabled = !loading) { Text("Refresh", color = MT_RED) }
            }
            if (loading) {
                Row(Modifier.fillMaxWidth().padding(18.dp), horizontalArrangement = Arrangement.Center, verticalAlignment = Alignment.CenterVertically) {
                    CircularProgressIndicator(modifier = Modifier.size(20.dp), color = MT_RED, strokeWidth = 2.dp)
                    Spacer(Modifier.width(9.dp))
                    Text("Checking live availability…", color = MT_MUTED, fontSize = 12.sp)
                }
            } else if (loadError != null) {
                Card(colors = CardDefaults.cardColors(containerColor = Color.White), shape = RoundedCornerShape(16.dp)) {
                    Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        Text("Could not load tests from the website.", color = MT_NAVY, fontWeight = FontWeight.Bold)
                        Text(loadError!!, color = MT_RED, fontSize = 12.sp)
                        Button(onClick = { scope.launch { loadTests() } }, colors = ButtonDefaults.buttonColors(containerColor = MT_RED)) { Text("Try again") }
                    }
                }
            } else if (tests.isEmpty()) {
                Card(colors = CardDefaults.cardColors(containerColor = Color.White), shape = RoundedCornerShape(16.dp)) {
                    Text("No mock tests are currently released on the website.", color = MT_MUTED, modifier = Modifier.padding(16.dp))
                }
            }
        }
        if (!loading && loadError == null) {
            items(tests, key = { "${it.subject}-${it.testNumber}" }) { test ->
                Card(colors = CardDefaults.cardColors(containerColor = Color.White), shape = RoundedCornerShape(18.dp), border = BorderStroke(1.dp, Color(0xFFE4EAF3))) {
                    Row(Modifier.padding(15.dp), verticalAlignment = Alignment.CenterVertically) {
                        Box(Modifier.size(42.dp).clip(RoundedCornerShape(12.dp)).background(Color(0xFFFFEEF0)), contentAlignment = Alignment.Center) {
                            Icon(if (test.subject == "physics") Icons.Default.Science else if (test.subject == "chemistry") Icons.Default.Assignment else Icons.Default.FactCheck, null, tint = MT_RED)
                        }
                        Spacer(Modifier.width(11.dp))
                        Column(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(3.dp)) {
                            Text(test.title, color = MT_NAVY, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                            Text("${test.questionCount} questions · ${test.durationMinutes} min · ${test.totalMarks.toInt()} marks", color = MT_MUTED, fontSize = 11.sp)
                            Text("LIVE FROM WEBSITE", color = Color(0xFF14856A), fontSize = 9.sp, fontWeight = FontWeight.ExtraBold)
                        }
                        Button(onClick = { begin(test) }, enabled = opening == null, colors = ButtonDefaults.buttonColors(containerColor = MT_RED), contentPadding = PaddingValues(horizontal = 12.dp, vertical = 8.dp)) {
                            if (opening == "${test.subject}-${test.testNumber}") CircularProgressIndicator(modifier = Modifier.size(16.dp), color = Color.White, strokeWidth = 2.dp)
                            else { Text("Start"); Spacer(Modifier.width(3.dp)); Icon(Icons.Default.PlayArrow, null, modifier = Modifier.size(15.dp)) }
                        }
                    }
                }
            }
        }
        item {
            Text("Physics and Chemistry appear here automatically when the website releases their papers. Chinese mock papers are not currently exposed by the existing mock-test API.", color = MT_MUTED, fontSize = 11.sp, lineHeight = 16.sp)
            Spacer(Modifier.height(4.dp))
            Surface(color = Color(0xFFFFEEF0), shape = RoundedCornerShape(14.dp)) {
                Text("These are GL Education practice papers, not official CSCA exams or previous-year papers.", color = MT_RED, fontSize = 12.sp, lineHeight = 17.sp, modifier = Modifier.padding(13.dp))
            }
        }
    }

    if (showPrevious && repeatExam != null && repeatCandidate != null && previous != null) {
        val prior = previous!!
        AlertDialog(
            onDismissRequest = { showPrevious = false },
            title = { Text("Previous attempt found") },
            text = { Text("Your earlier result is already saved: ${prior.score} / ${prior.totalMarks}. You can view that result or take the practice test again; a new attempt will be saved separately.") },
            confirmButton = {
                TextButton(onClick = { showPrevious = false; onStartExam(repeatExam!!, repeatCandidate!!) }) { Text("Take again", color = MT_RED) }
            },
            dismissButton = {
                Row {
                    TextButton(onClick = {
                        showPrevious = false
                        if (prior.token.isNotBlank()) {
                            try { context.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse("${ApiConfig.WEBSITE_BASE_URL}/csca/mocktest/result/${prior.token}"))) }
                            catch (_: Exception) { onInfo("Open your saved result at globlearnedu.com in a browser.") }
                        }
                    }) { Text("View result", color = MT_BLUE) }
                    TextButton(onClick = { showPrevious = false }) { Text("Cancel") }
                }
            },
            containerColor = Color.White
        )
    }
}

@Composable
fun NativeExamScreen(
    exam: PublicMockExam,
    candidate: MockCandidate,
    isSubmitting: Boolean,
    onSubmit: (List<Int>, Int, String) -> Unit,
    onExit: () -> Unit
) {
    var started by remember(exam) { mutableStateOf(false) }
    var current by remember(exam) { mutableStateOf(0) }
    var remaining by remember(exam) { mutableStateOf(exam.durationMinutes.coerceAtLeast(1) * 60) }
    var awayCount by remember(exam) { mutableStateOf(0) }
    var showSubmitConfirm by remember { mutableStateOf(false) }
    var showExitConfirm by remember { mutableStateOf(false) }
    var timerFinished by remember(exam) { mutableStateOf(false) }
    var startedAt by remember(exam) { mutableStateOf("") }
    val answers = remember(exam) { mutableStateListOf<Int>().apply { repeat(exam.questions.size) { add(-1) } } }
    val marked = remember(exam) { mutableStateListOf<Int>() }
    val latestSubmit by rememberUpdatedState(onSubmit)
    val latestAnswers by rememberUpdatedState(answers.toList())
    val latestAway by rememberUpdatedState(awayCount)
    val latestStart by rememberUpdatedState(startedAt)
    val latestStarted by rememberUpdatedState(started)
    val latestTimerFinished by rememberUpdatedState(timerFinished)
    val latestAwayCount by rememberUpdatedState(awayCount)
    val lifecycleOwner = LocalLifecycleOwner.current
    val activity = LocalContext.current as? ComponentActivity

    // Protect question content from ordinary Android screenshots while an attempt is active.
    SideEffect {
        if (started) activity?.window?.addFlags(WindowManager.LayoutParams.FLAG_SECURE)
        else activity?.window?.clearFlags(WindowManager.LayoutParams.FLAG_SECURE)
    }
    DisposableEffect(activity) {
        onDispose { activity?.window?.clearFlags(WindowManager.LayoutParams.FLAG_SECURE) }
    }

    // Count app-background events honestly; these are practice telemetry, not official proctoring.
    DisposableEffect(lifecycleOwner) {
        val observer = LifecycleEventObserver { _, event ->
            if (event == Lifecycle.Event.ON_PAUSE && latestStarted && !latestTimerFinished) {
                awayCount = (latestAwayCount + 1).coerceAtMost(1000)
            }
        }
        lifecycleOwner.lifecycle.addObserver(observer)
        onDispose { lifecycleOwner.lifecycle.removeObserver(observer) }
    }

    BackHandler(enabled = true) { showExitConfirm = true }

    LaunchedEffect(started, exam) {
        if (!started) return@LaunchedEffect
        while (remaining > 0) {
            delay(1000)
            remaining = (remaining - 1).coerceAtLeast(0)
        }
        if (remaining == 0 && !timerFinished) {
            timerFinished = true
            latestSubmit(latestAnswers, latestAway, latestStart)
        }
    }

    val answered = answers.count { it >= 0 }
    val timeText = "%02d:%02d".format(remaining / 60, remaining % 60)
    if (!started) {
        LazyColumn(Modifier.fillMaxSize().background(MT_BG), contentPadding = PaddingValues(20.dp), verticalArrangement = Arrangement.spacedBy(14.dp)) {
            item {
                Text("MOCK TEST · INSTRUCTIONS", color = MT_RED, fontSize = 10.sp, fontWeight = FontWeight.ExtraBold, letterSpacing = 1.4.sp)
                Text(exam.title, color = MT_NAVY, fontSize = 26.sp, lineHeight = 31.sp, fontWeight = FontWeight.Bold)
                Text("Candidate: ${candidate.name}", color = MT_MUTED, fontSize = 13.sp)
            }
            item {
                Row(horizontalArrangement = Arrangement.spacedBy(7.dp)) {
                    ExamPill(Icons.Default.Timer, "${exam.durationMinutes} min")
                    ExamPill(Icons.Default.Assignment, "${exam.questionCount} questions")
                    ExamPill(Icons.Default.CheckCircle, "${exam.totalMarks.toInt()} marks")
                }
            }
            item {
                Card(colors = CardDefaults.cardColors(containerColor = Color.White), shape = RoundedCornerShape(18.dp)) {
                    Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(9.dp)) {
                        Text("Before you start", color = MT_NAVY, fontSize = 17.sp, fontWeight = FontWeight.Bold)
                        exam.instructions.forEach { line ->
                            Row(verticalAlignment = Alignment.Top) {
                                Box(Modifier.padding(top = 6.dp).size(6.dp).clip(CircleShape).background(MT_RED))
                                Spacer(Modifier.width(9.dp))
                                Text(line, color = MT_MUTED, fontSize = 12.sp, lineHeight = 18.sp, modifier = Modifier.weight(1f))
                            }
                        }
                    }
                }
            }
            item {
                Surface(color = Color(0xFFFFEEF0), shape = RoundedCornerShape(14.dp)) {
                    Text("This is a GL Education practice exam, not an official CSCA exam sitting.", color = MT_RED, fontSize = 12.sp, modifier = Modifier.padding(13.dp))
                }
            }
            item {
                Button(onClick = { remaining = exam.durationMinutes.coerceAtLeast(1) * 60; startedAt = Instant.now().toString(); started = true }, modifier = Modifier.fillMaxWidth().height(51.dp), colors = ButtonDefaults.buttonColors(containerColor = MT_RED), shape = RoundedCornerShape(13.dp)) { Text("Start test", fontWeight = FontWeight.Bold) }
                TextButton(onClick = onExit, modifier = Modifier.fillMaxWidth()) { Text("Cancel", color = MT_MUTED) }
            }
        }
    } else {
        Column(Modifier.fillMaxSize().background(MT_BG).padding(horizontal = 12.dp, vertical = 9.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Column(Modifier.weight(1f)) {
                    Text("CSCA GO · PRACTICE", color = MT_RED, fontSize = 9.sp, fontWeight = FontWeight.ExtraBold, letterSpacing = 1.sp)
                    Text(exam.title, color = MT_NAVY, fontSize = 15.sp, fontWeight = FontWeight.Bold, maxLines = 2, overflow = TextOverflow.Ellipsis)
                }
                Surface(color = if (remaining < 300) Color(0xFFFFE5E8) else Color(0xFFEAF2FE), shape = RoundedCornerShape(10.dp)) {
                    Row(Modifier.padding(horizontal = 8.dp, vertical = 7.dp), verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.Timer, null, tint = if (remaining < 300) MT_RED else MT_BLUE, modifier = Modifier.size(16.dp))
                        Spacer(Modifier.width(4.dp))
                        Text(timeText, color = if (remaining < 300) MT_RED else MT_NAVY, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                    }
                }
            }
            Spacer(Modifier.height(7.dp))
            LinearProgressIndicator(progress = { if (answers.isEmpty()) 0f else answered.toFloat() / answers.size }, modifier = Modifier.fillMaxWidth().height(5.dp).clip(CircleShape), color = MT_RED, trackColor = Color(0xFFE2E8F0))
            Spacer(Modifier.height(5.dp))
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text("Answered $answered / ${exam.questions.size}", color = MT_MUTED, fontSize = 10.sp, modifier = Modifier.weight(1f))
                Text("Marked ${marked.size}", color = MT_MUTED, fontSize = 10.sp)
            }
            Spacer(Modifier.height(7.dp))
            Row(Modifier.fillMaxWidth().horizontalScroll(rememberScrollState()), horizontalArrangement = Arrangement.spacedBy(5.dp)) {
                exam.questions.indices.forEach { index ->
                    val selected = current == index
                    val background = when { selected -> MT_RED; index in marked -> Color(0xFFFFE4B5); answers[index] >= 0 -> Color(0xFFD9F3E7); else -> Color.White }
                    Surface(Modifier.size(34.dp).clickable { current = index }, color = background, shape = RoundedCornerShape(9.dp), border = BorderStroke(1.dp, if (selected) MT_RED else Color(0xFFE1E7F0))) {
                        Box(contentAlignment = Alignment.Center) { Text("${index + 1}", color = if (selected) Color.White else MT_NAVY, fontSize = 11.sp, fontWeight = FontWeight.Bold) }
                    }
                }
            }
            Spacer(Modifier.height(8.dp))
            val q = exam.questions.getOrNull(current)
            if (q != null) {
                Card(Modifier.weight(1f).fillMaxWidth(), colors = CardDefaults.cardColors(containerColor = Color.White), shape = RoundedCornerShape(17.dp), border = BorderStroke(1.dp, Color(0xFFE4EAF3))) {
                    Column(Modifier.fillMaxSize().padding(13.dp), verticalArrangement = Arrangement.spacedBy(9.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text("QUESTION ${current + 1}", color = MT_RED, fontSize = 10.sp, fontWeight = FontWeight.ExtraBold, letterSpacing = 1.sp)
                            Spacer(Modifier.weight(1f))
                            Text("${"%.2f".format(q.marks)} mark(s)", color = MT_MUTED, fontSize = 10.sp)
                        }
                        Text(q.prompt, color = MT_NAVY, fontSize = 16.sp, lineHeight = 23.sp, fontWeight = FontWeight.SemiBold)
                        Divider(color = Color(0xFFE8EDF4))
                        LazyColumn(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(7.dp)) {
                            items(q.options.size) { optionIndex ->
                                Row(Modifier.fillMaxWidth().clip(RoundedCornerShape(12.dp)).background(if (answers[current] == optionIndex) Color(0xFFFFEEF0) else Color(0xFFF8FAFD)).clickable { answers[current] = optionIndex }.padding(horizontal = 7.dp, vertical = 6.dp), verticalAlignment = Alignment.CenterVertically) {
                                    RadioButton(selected = answers[current] == optionIndex, onClick = { answers[current] = optionIndex })
                                    Spacer(Modifier.width(4.dp))
                                    Text(q.options[optionIndex], color = MT_NAVY, fontSize = 12.sp, lineHeight = 18.sp, modifier = Modifier.weight(1f))
                                }
                            }
                        }
                        OutlinedButton(onClick = { if (current in marked) marked.remove(current) else marked.add(current) }, modifier = Modifier.fillMaxWidth()) { Text(if (current in marked) "Remove review mark" else "Mark for review", color = MT_RED) }
                    }
                }
            }
            Spacer(Modifier.height(8.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(7.dp)) {
                OutlinedButton(onClick = { current = (current - 1).coerceAtLeast(0) }, enabled = current > 0, modifier = Modifier.weight(1f)) { Text("Previous") }
                Button(onClick = { if (current < exam.questions.lastIndex) current++ else showSubmitConfirm = true }, colors = ButtonDefaults.buttonColors(containerColor = MT_RED), modifier = Modifier.weight(1.4f)) { Text(if (current < exam.questions.lastIndex) "Next question" else "Review & submit", fontSize = 12.sp) }
            }
            TextButton(onClick = { showSubmitConfirm = true }, enabled = !isSubmitting, modifier = Modifier.align(Alignment.CenterHorizontally)) { Text(if (isSubmitting) "Submitting…" else "Submit test", color = MT_RED) }
        }
    }

    if (showSubmitConfirm) {
        AlertDialog(
            onDismissRequest = { if (!isSubmitting) showSubmitConfirm = false },
            title = { Text("Submit this mock test?") },
            text = { Text("You answered $answered of ${exam.questions.size} questions. The website will calculate and save your score.") },
            confirmButton = { TextButton(onClick = { if (!isSubmitting) { showSubmitConfirm = false; timerFinished = true; onSubmit(answers.toList(), awayCount, startedAt) } }, enabled = !isSubmitting) { Text("Submit now", color = MT_RED) } },
            dismissButton = { TextButton(onClick = { showSubmitConfirm = false }, enabled = !isSubmitting) { Text("Continue test") } }
        )
    }

    if (showExitConfirm) {
        AlertDialog(
            onDismissRequest = { showExitConfirm = false },
            title = { Text("Leave this mock test?") },
            text = { Text(if (started) "Leaving abandons this attempt without saving a result. Submit it first if you want the result recorded." else "Return to the available-test list?") },
            confirmButton = { TextButton(onClick = { showExitConfirm = false; onExit() }) { Text("Leave test", color = MT_RED) } },
            dismissButton = { TextButton(onClick = { showExitConfirm = false }) { Text("Stay in test") } }
        )
    }
}

@Composable
private fun ExamPill(icon: androidx.compose.ui.graphics.vector.ImageVector, label: String) {
    Surface(color = Color.White, shape = RoundedCornerShape(11.dp), border = BorderStroke(1.dp, Color(0xFFE5EAF2))) {
        Row(Modifier.padding(horizontal = 8.dp, vertical = 8.dp), verticalAlignment = Alignment.CenterVertically) {
            Icon(icon, null, tint = MT_RED, modifier = Modifier.size(16.dp))
            Spacer(Modifier.width(4.dp))
            Text(label, color = MT_NAVY, fontSize = 10.sp, fontWeight = FontWeight.Bold)
        }
    }
}

@Composable
fun NativeResultScreen(result: JSONObject, onBack: () -> Unit, onViewWebResult: () -> Unit) {
    val score = result.optDouble("score", 0.0)
    val total = result.optDouble("total_marks", 0.0)
    val percent = if (total > 0) score / total * 100 else 0.0
    val subject = result.optString("subject", "Mock Test").replaceFirstChar { it.uppercase() }
    val testNumber = result.optInt("test_number", 0)
    val questions = result.optInt("question_count", 0)
    val away = result.optInt("away_count", 0)
    LazyColumn(Modifier.fillMaxSize().background(MT_BG), contentPadding = PaddingValues(20.dp), verticalArrangement = Arrangement.spacedBy(14.dp), horizontalAlignment = Alignment.CenterHorizontally) {
        item {
            Box(Modifier.size(70.dp).clip(CircleShape).background(Color(0xFFFFEEF0)), contentAlignment = Alignment.Center) { Icon(Icons.Default.CheckCircle, null, tint = MT_RED, modifier = Modifier.size(38.dp)) }
            Spacer(Modifier.height(12.dp))
            Text("Test submitted", color = MT_NAVY, fontSize = 27.sp, fontWeight = FontWeight.Bold)
            Text("$subject · Mock Test $testNumber", color = MT_MUTED, fontSize = 13.sp)
        }
        item {
            Card(colors = CardDefaults.cardColors(containerColor = MT_NAVY), shape = RoundedCornerShape(23.dp)) {
                Column(Modifier.fillMaxWidth().padding(24.dp), horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text("YOUR PRACTICE SCORE", color = Color(0xFFFFB8C3), fontSize = 10.sp, fontWeight = FontWeight.ExtraBold, letterSpacing = 1.3.sp)
                    Text("${"%.2f".format(score)} / ${"%.2f".format(total)}", color = Color.White, fontSize = 31.sp, fontWeight = FontWeight.ExtraBold)
                    Text("${"%.1f".format(percent)}%", color = Color(0xFFD5E3F6), fontSize = 18.sp, fontWeight = FontWeight.Bold)
                }
            }
        }
        item {
            Card(colors = CardDefaults.cardColors(containerColor = Color.White), shape = RoundedCornerShape(17.dp)) {
                Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    ResultLine("Question count", questions.toString())
                    ResultLine("App-background events during practice", away.toString())
                    ResultLine("Saved to GL Education website", "Yes")
                    Text("This is a GL Education practice result, not an official CSCA score. The website server calculated and saved it. App-background events are recorded as practice telemetry and do not prove misconduct.", color = MT_MUTED, fontSize = 12.sp, lineHeight = 18.sp)
                }
            }
        }
        item {
            Button(onClick = onViewWebResult, modifier = Modifier.fillMaxWidth().height(50.dp), colors = ButtonDefaults.buttonColors(containerColor = MT_RED), shape = RoundedCornerShape(13.dp)) {
                Text("View full saved result")
                Spacer(Modifier.width(8.dp))
                Icon(Icons.Default.ArrowForward, null, modifier = Modifier.size(17.dp))
            }
            OutlinedButton(onClick = onBack, modifier = Modifier.fillMaxWidth()) {
                Icon(Icons.Default.ArrowBack, null, modifier = Modifier.size(16.dp))
                Spacer(Modifier.width(7.dp))
                Text("Back to Mock Tests")
            }
        }
    }
}

@Composable
private fun ResultLine(label: String, value: String) {
    Row(Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
        Text(label, color = MT_MUTED, fontSize = 12.sp, modifier = Modifier.weight(1f))
        Text(value, color = MT_NAVY, fontWeight = FontWeight.Bold, fontSize = 12.sp)
    }
}
