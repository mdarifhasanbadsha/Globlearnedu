package com.globlearnedu.cscago

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.BackHandler
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.compose.setContent
import androidx.activity.result.PickVisualMediaRequest
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.asPaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBars
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AccountCircle
import androidx.compose.material.icons.filled.ArrowForward
import androidx.compose.material.icons.filled.AutoStories
import androidx.compose.material.icons.filled.Book
import androidx.compose.material.icons.filled.CalendarMonth
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.ChevronRight
import androidx.compose.material.icons.filled.Assignment
import androidx.compose.material.icons.filled.EmojiEvents
import androidx.compose.material.icons.filled.FactCheck
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.Forum
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Language
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.MenuBook
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.PhotoCamera
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Public
import androidx.compose.material.icons.filled.QueryStats
import androidx.compose.material.icons.filled.School
import androidx.compose.material.icons.filled.Science
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material.icons.filled.Timer
import androidx.compose.material.icons.filled.Verified
import androidx.compose.material.icons.filled.WorkspacePremium
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.AssistChip
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Divider
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import androidx.compose.foundation.Image
import androidx.compose.ui.graphics.asImageBitmap
import android.graphics.BitmapFactory
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.net.URL
import org.json.JSONObject

private val Navy = Color(0xFF132746)
private val Blue = Color(0xFF2E67B1)
private val Sky = Color(0xFF80C8F9)
private val Canvas = Color(0xFFF5F7FB)
private val Ink = Color(0xFF192A43)
private val Muted = Color(0xFF697A91)
private val Teal = Color(0xFF1E9B88)
private val Red = Color(0xFFC8102E)
private val PaleRed = Color(0xFFFFEEF0)
private val Gold = Color(0xFFFFC76A)

private val AppColors = lightColorScheme(
    primary = Red,
    onPrimary = Color.White,
    secondary = Blue,
    background = Canvas,
    surface = Color.White,
    onBackground = Ink,
    onSurface = Ink
)

private enum class Tab(val label: String, val icon: ImageVector) {
    Home("Home", Icons.Default.Home),
    Learn("Learn", Icons.Default.School),
    Materials("Materials", Icons.Default.MenuBook),
    Tests("Mock Tests", Icons.Default.Assignment),
    Profile("Profile", Icons.Default.Person)
}

private data class Subject(val name: String, val subtitle: String, val icon: ImageVector)
private val subjects = listOf(
    Subject("Mathematics", "Official syllabus and topic guide", Icons.Default.FactCheck),
    Subject("Physics", "Concepts, formulas and topic guide", Icons.Default.Science),
    Subject("Chemistry", "Topics and learning resources", Icons.Default.AutoStories),
    Subject("Professional Chinese (Humanities) · 文科中文", "Official Chinese-language test category for humanities tracks", Icons.Default.Language),
    Subject("Professional Chinese (Science) · 理科中文", "Official Chinese-language test category for science tracks", Icons.Default.Language)
)

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        window.statusBarColor = android.graphics.Color.rgb(245, 247, 251)
        window.navigationBarColor = android.graphics.Color.WHITE
        window.decorView.systemUiVisibility = android.view.View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR or
            android.view.View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR
        setContent {
            MaterialTheme(colorScheme = AppColors) {
                CSCAApp()
            }
        }
    }
}

@Composable
private fun CSCAApp() {
    val context = LocalContext.current
    var selectedTab by remember { mutableStateOf(Tab.Home) }
    var selectedSubject by remember { mutableStateOf<Subject?>(null) }
    var showExamHub by remember { mutableStateOf(false) }
    var showSetupGuide by remember { mutableStateOf(false) }
    var profileUri by remember { mutableStateOf<String?>(null) }
    var studentName by remember { mutableStateOf("New student") }
    var infoDialog by remember { mutableStateOf<String?>(null) }
    var showExitConfirm by remember { mutableStateOf(false) }
    var authLoaded by remember { mutableStateOf(false) }
    var sessionToken by remember { mutableStateOf<String?>(null) }
    var authUser by remember { mutableStateOf<MobileUser?>(null) }
    var activeExam by remember { mutableStateOf<PublicMockExam?>(null) }
    var examCandidate by remember { mutableStateOf<MockCandidate?>(null) }
    var examSubmitting by remember { mutableStateOf(false) }
    var submissionResult by remember { mutableStateOf<JSONObject?>(null) }
    val authScope = rememberCoroutineScope()

    androidx.compose.runtime.LaunchedEffect(Unit) {
        val prefs = context.getSharedPreferences("csca_go_profile", 0)
        profileUri = prefs.getString("photo_uri", null)
        studentName = prefs.getString("student_name", "New student") ?: "New student"

        val savedToken = SessionStore.read(context)
        if (!savedToken.isNullOrBlank()) {
            try {
                val loadedUser = MobileAuthApi.me(savedToken)
                authUser = loadedUser
                sessionToken = savedToken
                studentName = loadedUser.name.ifBlank { loadedUser.firstName.ifBlank { "Student" } }
                // Server profile is authoritative: never show a previously signed-in student's local photo.
                profileUri = loadedUser.image
                prefs.edit().putString("student_name", studentName).apply()
                if (!loadedUser.image.isNullOrBlank()) {
                    prefs.edit().putString("photo_uri", loadedUser.image).apply()
                } else {
                    prefs.edit().remove("photo_uri").apply()
                }
            } catch (_: Exception) {
                SessionStore.clear(context)
            }
        }
        authLoaded = true
    }

    BackHandler(enabled = authLoaded && sessionToken != null && authUser != null && activeExam == null) {
        when {
            submissionResult != null -> submissionResult = null
            selectedSubject != null -> selectedSubject = null
            showSetupGuide -> showSetupGuide = false
            showExamHub -> showExamHub = false
            selectedTab != Tab.Home -> { selectedTab = Tab.Home; selectedSubject = null }
            else -> showExitConfirm = true
        }
    }

    val photoPicker = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.PickVisualMedia()
    ) { uri: Uri? ->
        if (uri != null) {
            try { context.contentResolver.takePersistableUriPermission(uri, Intent.FLAG_GRANT_READ_URI_PERMISSION) } catch (_: Exception) {}
            profileUri = uri.toString()
            val token = sessionToken
            if (!token.isNullOrBlank()) {
                authScope.launch {
                    try {
                        val updated = MobileAuthApi.uploadProfilePhoto(context, token, uri)
                        authUser = updated
                        profileUri = updated.image
                        context.getSharedPreferences("csca_go_profile", 0).edit().putString("photo_uri", updated.image).apply()
                        infoDialog = "Your profile picture has been saved to your GL Education account."
                    } catch (e: Exception) {
                        infoDialog = e.message ?: "The photo is visible on this device, but upload failed. Please try again."
                    }
                }
            }
        }
    }

    if (!authLoaded) {
        Box(Modifier.fillMaxSize().background(Canvas), contentAlignment = Alignment.Center) {
            Column(horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.spacedBy(12.dp)) {
                androidx.compose.material3.CircularProgressIndicator(color = Red)
                Text("Connecting to GL Education…", color = Muted, fontSize = 13.sp)
            }
        }
        return
    }

    if (sessionToken.isNullOrBlank() || authUser == null) {
        AuthScreen(onAuthenticated = { token, user ->
            SessionStore.save(context, token)
            sessionToken = token
            authUser = user
            studentName = user.name.ifBlank { user.firstName.ifBlank { "Student" } }
            profileUri = user.image
            context.getSharedPreferences("csca_go_profile", 0).edit().apply {
                putString("student_name", studentName)
                if (!user.image.isNullOrBlank()) putString("photo_uri", user.image) else remove("photo_uri")
            }
        })
        return
    }

    Scaffold(
        containerColor = Canvas,
        contentWindowInsets = WindowInsets(0, 0, 0, 0),
        bottomBar = {
            if (activeExam == null && submissionResult == null) {
                NavigationBar(containerColor = Color.White, tonalElevation = 8.dp) {
                    Tab.entries.forEach { tab ->
                        NavigationBarItem(
                            selected = selectedTab == tab,
                            onClick = { selectedTab = tab; selectedSubject = null; showExamHub = false; showSetupGuide = false },
                            icon = { Icon(tab.icon, contentDescription = tab.label) },
                            label = { Text(tab.label, fontSize = 10.sp, maxLines = 1) }
                        )
                    }
                }
            }
        }
    ) { padding ->
        Box(Modifier.fillMaxSize().padding(padding)) {
            when {
                activeExam != null && examCandidate != null -> NativeExamScreen(
                    exam = activeExam!!,
                    candidate = examCandidate!!,
                    isSubmitting = examSubmitting,
                    onExit = { activeExam = null; examCandidate = null },
                    onSubmit = { answers, awayCount, startedAt ->
                        if (!examSubmitting) {
                            examSubmitting = true
                            authScope.launch {
                                try {
                                    val saved = MockTestApi.submit(activeExam!!, examCandidate!!, answers, awayCount, startedAt)
                                    submissionResult = saved
                                    activeExam = null
                                    examCandidate = null
                                    selectedTab = Tab.Tests
                                } catch (e: Exception) {
                                    infoDialog = e.message ?: "The result could not be submitted. Your exam screen remains open; check the connection and retry."
                                } finally {
                                    examSubmitting = false
                                }
                            }
                        }
                    }
                )
                submissionResult != null -> NativeResultScreen(
                    result = submissionResult!!,
                    onBack = { submissionResult = null; selectedTab = Tab.Tests },
                    onViewWebResult = {
                        val token = submissionResult?.optString("token").orEmpty()
                        if (token.isNotBlank()) openUrl(context, "${ApiConfig.WEBSITE_BASE_URL}/csca/mocktest/result/$token")
                        else infoDialog = "The result was saved, but the website did not return a result link."
                    }
                )
                else -> {
            AnimatedContent(targetState = selectedTab to (showExamHub to (showSetupGuide to selectedSubject)), label = "screen-transition") { state ->
                val (tab, nested) = state
                val (hub, nested2) = nested
                val (setup, subject) = nested2
                when {
                    tab == Tab.Home && setup -> OnlineSetupScreen(onBack = { showSetupGuide = false })
                    tab == Tab.Home && hub -> ExamHubScreen(onBack = { showExamHub = false }, onSetup = { showSetupGuide = true }, onOfficial = { openUrl(context, ApiConfig.OFFICIAL_CSCA_URL) })
                    tab == Tab.Materials && subject != null -> SubjectDetailScreen(subject!!, onBack = { selectedSubject = null })
                    tab == Tab.Home -> HomeScreen(
                        studentName = studentName,
                        profileUri = profileUri,
                        onProfile = { selectedTab = Tab.Profile },
                        onExamHub = { showExamHub = true },
                        onSetup = { showSetupGuide = true },
                        onLearn = { selectedTab = Tab.Learn },
                        onMaterials = { selectedTab = Tab.Materials },
                        onTests = { selectedTab = Tab.Tests },
                        onChina = { infoDialog = "Study in China with GL Education\n\nExplore language programs, bachelor's, master's and PhD opportunities, scholarship options, application guidance, visa guidance, and pre-departure support.\n\nContact: globlearneducation on WeChat · WhatsApp +8619705199269 / +8801993-295109\n\nProgram availability and scholarship terms must be confirmed for each intake." }
                    )
                    tab == Tab.Learn -> LearnScreen(onInfo = { infoDialog = it }, onHomework = { infoDialog = "Homework integration will be connected after the website backend/API audit. This screen is designed to show released assignments for courses the student has enrolled in, including due dates, submissions, marks and feedback." })
                    tab == Tab.Materials -> MaterialsScreen(onSubject = { selectedSubject = it }, onPrevious = { infoDialog = "Previous-year question papers will appear here when you upload them. Until then, the app will clearly mark this section as coming soon and will not label practice questions as official past papers." })
                    tab == Tab.Tests -> ConnectedTestsScreen(
                        user = authUser!!,
                        onStartExam = { exam, candidate -> activeExam = exam; examCandidate = candidate; submissionResult = null },
                        onExamGuide = { selectedTab = Tab.Home; showSetupGuide = false; showExamHub = true },
                        onInfo = { infoDialog = it }
                    )
                    else -> ProfileScreen(
                        profileUri = profileUri,
                        studentName = studentName,
                        onLogout = {
                            val token = sessionToken
                            authScope.launch {
                                if (!token.isNullOrBlank()) MobileAuthApi.logout(token)
                                SessionStore.clear(context)
                                sessionToken = null
                                authUser = null
                                profileUri = null
                                studentName = "New student"
                                context.getSharedPreferences("csca_go_profile", 0).edit()
                                    .remove("photo_uri").remove("student_name").apply()
                                submissionResult = null
                                activeExam = null
                                examCandidate = null
                                selectedTab = Tab.Home
                                selectedSubject = null
                                showExamHub = false
                                showSetupGuide = false
                            }
                        },
                        onPickPhoto = { photoPicker.launch(PickVisualMediaRequest(ActivityResultContracts.PickVisualMedia.ImageOnly)) },
                        onNameChange = {
                            studentName = it
                            context.getSharedPreferences("csca_go_profile", 0).edit().putString("student_name", it).apply()
                            val token = sessionToken
                            if (!token.isNullOrBlank()) {
                                authScope.launch {
                                    try {
                                        val updated = MobileAuthApi.updateDisplayName(token, it)
                                        authUser = updated
                                        studentName = updated.name.ifBlank { updated.firstName }
                                        context.getSharedPreferences("csca_go_profile", 0).edit().putString("student_name", studentName).apply()
                                        infoDialog = "Your display name has been saved to your GL Education account."
                                    } catch (e: Exception) {
                                        infoDialog = e.message ?: "The display name changed locally but could not be synced to your account."
                                    }
                                }
                            }
                        },
                        onInfo = { infoDialog = it }
                    )
                }
            }
                }
            }
        }
    }

    if (showExitConfirm) {
        AlertDialog(
            onDismissRequest = { showExitConfirm = false },
            title = { Text("Exit CSCA Go?") },
            text = { Text("You are at the home screen. Do you want to close the app?") },
            confirmButton = {
                TextButton(onClick = { showExitConfirm = false; (context as? ComponentActivity)?.finish() }) {
                    Text("Exit", color = Red)
                }
            },
            dismissButton = { TextButton(onClick = { showExitConfirm = false }) { Text("Stay in app") } },
            containerColor = Color.White
        )
    }

    if (infoDialog != null) {
        AlertDialog(
            onDismissRequest = { infoDialog = null },
            confirmButton = { TextButton(onClick = { infoDialog = null }) { Text("Got it") } },
            title = { Text("CSCA Go") },
            text = { Text(infoDialog ?: "") },
            containerColor = Color.White
        )
    }
}

private fun openUrl(context: android.content.Context, url: String) {
    try { context.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url))) } catch (_: Exception) {}
}

@Composable
private fun HomeScreen(
    studentName: String,
    profileUri: String?,
    onProfile: () -> Unit,
    onExamHub: () -> Unit,
    onSetup: () -> Unit,
    onLearn: () -> Unit,
    onMaterials: () -> Unit,
    onTests: () -> Unit,
    onChina: () -> Unit
) {
    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(start = 18.dp, end = 18.dp, top = 14.dp, bottom = 28.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.fillMaxWidth()) {
                Column(Modifier.weight(1f)) {
                    Text("CSCA GO", color = Red, fontSize = 12.sp, fontWeight = FontWeight.ExtraBold, letterSpacing = 2.sp)
                    Text("Hello, $studentName", color = Navy, fontSize = 24.sp, fontWeight = FontWeight.Bold)
                    Text("Your China study journey starts here.", color = Muted, fontSize = 13.sp)
                }
                Box(Modifier.size(52.dp).clip(CircleShape).background(Color.White).clickable(onClick = onProfile), contentAlignment = Alignment.Center) {
                    ProfileImage(profileUri = profileUri, modifier = Modifier.fillMaxSize())
                }
            }
        }
        item { HeroCard(onExamHub = onExamHub, onSetup = onSetup) }
        item {
            SectionHeader("Your preparation", "Make progress every day")
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                QuickTile("Mock Tests", "Timed practice", Icons.Default.Timer, Modifier.weight(1f), onTests)
                QuickTile("Materials", "Syllabus & guides", Icons.Default.MenuBook, Modifier.weight(1f), onMaterials)
            }
            Spacer(Modifier.height(10.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                QuickTile("Courses", "Free & premium", Icons.Default.School, Modifier.weight(1f), onLearn)
                QuickTile("Exam setup", "Online rules", Icons.Default.Shield, Modifier.weight(1f), onSetup)
            }
        }
        item {
            Card(
                modifier = Modifier.fillMaxWidth().clickable(onClick = onExamHub),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                shape = RoundedCornerShape(22.dp),
                border = BorderStroke(1.dp, Color(0xFFE4EAF3))
            ) {
                Column(Modifier.padding(17.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.CalendarMonth, contentDescription = null, tint = Red)
                        Spacer(Modifier.width(8.dp))
                        Text("CSCA exam information", fontWeight = FontWeight.Bold, fontSize = 18.sp, color = Navy)
                        Spacer(Modifier.weight(1f))
                        Icon(Icons.Default.ChevronRight, contentDescription = null, tint = Muted)
                    }
                    Text("Exam dates · formats · registration · subjects · online environment · candidate rules", color = Muted, fontSize = 13.sp)
                    Button(onClick = onExamHub, colors = ButtonDefaults.buttonColors(containerColor = Red), shape = RoundedCornerShape(13.dp), contentPadding = PaddingValues(horizontal = 16.dp, vertical = 10.dp)) {
                        Text("Explore exam guide")
                        Spacer(Modifier.width(6.dp))
                        Icon(Icons.Default.ArrowForward, contentDescription = null, modifier = Modifier.size(16.dp))
                    }
                }
            }
        }
        item {
            Card(
                modifier = Modifier.fillMaxWidth().clickable(onClick = onChina),
                colors = CardDefaults.cardColors(containerColor = Navy),
                shape = RoundedCornerShape(22.dp)
            ) {
                Row(Modifier.padding(18.dp), verticalAlignment = Alignment.CenterVertically) {
                    Box(Modifier.size(54.dp).clip(RoundedCornerShape(16.dp)).background(Color(0xFF284B7D)), contentAlignment = Alignment.Center) {
                        Icon(Icons.Default.Public, contentDescription = null, tint = Sky, modifier = Modifier.size(30.dp))
                    }
                    Spacer(Modifier.width(14.dp))
                    Column(Modifier.weight(1f)) {
                        Text("STUDY IN CHINA", color = Gold, fontSize = 11.sp, fontWeight = FontWeight.Bold, letterSpacing = 1.4.sp)
                        Text("Turn preparation into opportunity", color = Color.White, fontSize = 17.sp, fontWeight = FontWeight.Bold)
                        Text("Programs, scholarships & GL Education support", color = Color(0xFFD0DDF0), fontSize = 12.sp)
                    }
                    Icon(Icons.Default.ArrowForward, contentDescription = null, tint = Color.White)
                }
            }
        }
        item {
            SectionHeader("Start with the basics", "New to CSCA?")
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                GuideRow(Icons.Default.Info, "What is the CSCA?", "Understand purpose, format and preparation", onExamHub)
                GuideRow(Icons.Default.Shield, "Online exam environment", "Know the room, equipment and camera setup", onSetup)
                GuideRow(Icons.Default.Verified, "Candidate rules", "Learn what is allowed and prohibited", onExamHub)
            }
        }
        item {
            Text("CSCA Go · by GL Education", color = Muted, fontSize = 11.sp, modifier = Modifier.fillMaxWidth().padding(top = 4.dp))
        }
    }
}

@Composable
private fun HeroCard(onExamHub: () -> Unit, onSetup: () -> Unit) {
    val transition = rememberInfiniteTransition(label = "hero-glow")
    val shift by transition.animateFloat(
        initialValue = 0.0f, targetValue = 1.0f,
        animationSpec = infiniteRepeatable(animation = tween(4200, easing = FastOutSlowInEasing), repeatMode = RepeatMode.Reverse),
        label = "glow"
    )
    val accent by animateColorAsState(if (shift > 0.5f) Color(0xFF3475C9) else Color(0xFF244B85), label = "hero-accent")
    Box(
        modifier = Modifier.fillMaxWidth().clip(RoundedCornerShape(26.dp))
            .background(Brush.linearGradient(listOf(Navy, accent, Color(0xFF1A6680))))
            .padding(20.dp)
    ) {
        Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Surface(color = Color(0x334FC5F3), shape = RoundedCornerShape(50)) {
                    Text("YOUR CSCA COMPANION", color = Color(0xFFB9E7FF), fontSize = 10.sp, fontWeight = FontWeight.Bold, letterSpacing = 1.2.sp, modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp))
                }
                Spacer(Modifier.weight(1f))
                Icon(Icons.Default.School, contentDescription = null, tint = Sky, modifier = Modifier.size(32.dp).scale(0.96f + shift * 0.08f))
            }
            Text("Your next chapter\nstarts with preparation.", color = Color.White, fontSize = 27.sp, lineHeight = 32.sp, fontWeight = FontWeight.ExtraBold)
            Text("Exam information, study materials, courses and practice — all in one place.", color = Color(0xFFD5E3F6), fontSize = 13.sp, lineHeight = 19.sp)
            Row(horizontalArrangement = Arrangement.spacedBy(9.dp)) {
                Button(onClick = onExamHub, colors = ButtonDefaults.buttonColors(containerColor = Color.White, contentColor = Navy), shape = RoundedCornerShape(13.dp)) {
                    Text("Explore CSCA")
                }
                OutlinedButton(onClick = onSetup, border = BorderStroke(1.dp, Color(0xFF9DBFE8)), colors = ButtonDefaults.outlinedButtonColors(contentColor = Color.White), shape = RoundedCornerShape(13.dp)) {
                    Text("Exam setup")
                }
            }
        }
    }
}

@Composable
private fun SectionHeader(title: String, subtitle: String) {
    Column(Modifier.padding(bottom = 10.dp)) {
        Text(title, color = Navy, fontWeight = FontWeight.Bold, fontSize = 18.sp)
        Text(subtitle, color = Muted, fontSize = 12.sp)
    }
}

@Composable
private fun QuickTile(title: String, subtitle: String, icon: ImageVector, modifier: Modifier, onClick: () -> Unit) {
    Card(
        modifier = modifier.clickable(onClick = onClick),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        shape = RoundedCornerShape(18.dp),
        border = BorderStroke(1.dp, Color(0xFFE6EBF3))
    ) {
        Column(Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Box(Modifier.size(38.dp).clip(RoundedCornerShape(12.dp)).background(Color(0xFFEAF2FE)), contentAlignment = Alignment.Center) {
                Icon(icon, contentDescription = null, tint = Blue)
            }
            Text(title, color = Navy, fontWeight = FontWeight.Bold, fontSize = 14.sp)
            Text(subtitle, color = Muted, fontSize = 11.sp, maxLines = 2, overflow = TextOverflow.Ellipsis)
        }
    }
}

@Composable
private fun GuideRow(icon: ImageVector, title: String, subtitle: String, onClick: () -> Unit) {
    Row(
        Modifier.fillMaxWidth().clip(RoundedCornerShape(15.dp)).background(Color.White)
            .clickable(onClick = onClick).padding(13.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(icon, contentDescription = null, tint = Blue, modifier = Modifier.size(24.dp))
        Spacer(Modifier.width(12.dp))
        Column(Modifier.weight(1f)) {
            Text(title, color = Ink, fontSize = 14.sp, fontWeight = FontWeight.SemiBold)
            Text(subtitle, color = Muted, fontSize = 11.sp)
        }
        Icon(Icons.Default.ChevronRight, contentDescription = null, tint = Muted)
    }
}

@Composable
private fun LearnScreen(onInfo: (String) -> Unit, onHomework: () -> Unit) {
    var selected by remember { mutableStateOf("Courses") }
    LazyColumn(Modifier.fillMaxSize(), contentPadding = PaddingValues(18.dp), verticalArrangement = Arrangement.spacedBy(14.dp)) {
        item {
            Text("Learn", color = Navy, fontSize = 28.sp, fontWeight = FontWeight.Bold)
            Text("Free preparation, premium learning and course homework.", color = Muted, fontSize = 13.sp)
            Spacer(Modifier.height(6.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                listOf("Courses", "Homework").forEach { label ->
                    val active = selected == label
                    AssistChip(onClick = { selected = label }, label = { Text(label) }, leadingIcon = { if (active) Icon(Icons.Default.CheckCircle, null, modifier = Modifier.size(16.dp)) })
                }
            }
        }
        if (selected == "Courses") {
            item {
                Card(colors = CardDefaults.cardColors(containerColor = Navy), shape = RoundedCornerShape(22.dp)) {
                    Column(Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(9.dp)) {
                        Text("FREE · FEATURED", color = Gold, fontSize = 11.sp, fontWeight = FontWeight.Bold, letterSpacing = 1.sp)
                        Text("CSCA Preparation Course", color = Color.White, fontSize = 22.sp, fontWeight = FontWeight.Bold)
                        Text("Build foundations across CSCA subjects, attend classes, practise and track assignment progress.", color = Color(0xFFD5E3F6), fontSize = 13.sp)
                        Button(onClick = { onInfo("The free CSCA Preparation Course is highlighted here. Enrollment status, batch details, class schedule and homework availability will be read from the existing GL Education system after the API audit.") }, colors = ButtonDefaults.buttonColors(containerColor = Color.White, contentColor = Navy)) { Text("View free course") }
                    }
                }
            }
            item { SectionHeader("Premium courses", "Course listings can be managed from the connected platform") }
            items(listOf(
                "CSCA Mathematics Master Course" to "Structured topic lessons, worked examples and practice.",
                "CSCA Physics Master Course" to "Concept review, formulas and guided problem-solving.",
                "CSCA Chemistry Master Course" to "Core concepts, topic practice and revision.",
                "CSCA Chinese Preparation" to "Language preparation for the relevant CSCA Chinese category."
            )) { course ->
                Card(
                    modifier = Modifier.fillMaxWidth().clickable {
                        onInfo("${course.first}: course details, price, and enrollment are not connected to the live course catalog yet. This card is informational only; no enrollment or payment is made.")
                    },
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    shape = RoundedCornerShape(18.dp),
                    border = BorderStroke(1.dp, Color(0xFFE6EBF3))
                ) {
                    Row(Modifier.padding(15.dp), verticalAlignment = Alignment.CenterVertically) {
                        Box(Modifier.size(44.dp).clip(RoundedCornerShape(13.dp)).background(Color(0xFFF1EDFF)), contentAlignment = Alignment.Center) {
                            Icon(Icons.Default.WorkspacePremium, null, tint = Color(0xFF7557BC), modifier = Modifier.size(25.dp))
                        }
                        Spacer(Modifier.width(12.dp))
                        Column(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                            Text(course.first, color = Navy, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                            Text(course.second, color = Muted, fontSize = 12.sp)
                            Text("PREMIUM · DETAILS TO BE CONNECTED", color = Color(0xFF7557BC), fontSize = 9.sp, fontWeight = FontWeight.Bold)
                        }
                        Icon(Icons.Default.ChevronRight, null, tint = Muted)
                    }
                }
            }
            item { Text("Premium prices, access conditions and enrollment must be loaded from the website; no prices are invented in this prototype.", color = Muted, fontSize = 11.sp) }
        } else {
            item {
                Card(colors = CardDefaults.cardColors(containerColor = Color.White), shape = RoundedCornerShape(18.dp)) {
                    Column(Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        Icon(Icons.Default.FactCheck, null, tint = Blue, modifier = Modifier.size(30.dp))
                        Text("Your homework", color = Navy, fontWeight = FontWeight.Bold, fontSize = 18.sp)
                        Text("Assignments from courses you have joined will appear here when released. See due dates, submit answers and review results when published.", color = Muted, fontSize = 13.sp)
                        Button(onClick = onHomework) { Text("View homework status") }
                    }
                }
            }
        }
    }
}

@Composable
private fun MaterialsScreen(onSubject: (Subject) -> Unit, onPrevious: () -> Unit) {
    LazyColumn(Modifier.fillMaxSize(), contentPadding = PaddingValues(18.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        item {
            Text("Study Materials", color = Navy, fontSize = 27.sp, fontWeight = FontWeight.Bold)
            Text("Official syllabus, subject guides and previous-year question papers.", color = Muted, fontSize = 13.sp)
        }
        item {
            Card(colors = CardDefaults.cardColors(containerColor = Color(0xFFE8F1FF)), shape = RoundedCornerShape(18.dp)) {
                Row(Modifier.padding(15.dp), verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.Verified, null, tint = Blue, modifier = Modifier.size(28.dp))
                    Spacer(Modifier.width(12.dp))
                    Column {
                        Text("Official syllabus", color = Navy, fontWeight = FontWeight.Bold)
                        Text("Browse each subject and its detailed topic structure.", color = Muted, fontSize = 12.sp)
                    }
                }
            }
        }
        items(subjects) { subject ->
            Card(
                modifier = Modifier.fillMaxWidth().clickable { onSubject(subject) },
                colors = CardDefaults.cardColors(containerColor = Color.White),
                shape = RoundedCornerShape(17.dp),
                border = BorderStroke(1.dp, Color(0xFFE5EAF2))
            ) {
                Row(Modifier.padding(15.dp), verticalAlignment = Alignment.CenterVertically) {
                    Box(Modifier.size(44.dp).clip(RoundedCornerShape(13.dp)).background(Color(0xFFEAF2FE)), contentAlignment = Alignment.Center) {
                        Icon(subject.icon, null, tint = Blue, modifier = Modifier.size(24.dp))
                    }
                    Spacer(Modifier.width(12.dp))
                    Column(Modifier.weight(1f)) {
                        Text(subject.name, color = Navy, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                        Text(subject.subtitle, color = Muted, fontSize = 11.sp)
                    }
                    Icon(Icons.Default.ChevronRight, null, tint = Muted)
                }
            }
        }
        item {
            Card(modifier = Modifier.fillMaxWidth().clickable(onClick = onPrevious), colors = CardDefaults.cardColors(containerColor = Navy), shape = RoundedCornerShape(18.dp)) {
                Row(Modifier.padding(17.dp), verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.AutoStories, null, tint = Sky, modifier = Modifier.size(28.dp))
                    Spacer(Modifier.width(12.dp))
                    Column(Modifier.weight(1f)) {
                        Text("Previous-year questions", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                        Text("Question paper library · uploads coming soon", color = Color(0xFFD5E3F6), fontSize = 12.sp)
                    }
                    Icon(Icons.Default.ArrowForward, null, tint = Color.White)
                }
            }
        }
        item {
            Text("Syllabus note: this screen is a subject navigation structure. Exact topic-by-topic official text and downloadable resources should be imported from current CSCA documents after review; do not treat this placeholder as the complete official syllabus.", color = Muted, fontSize = 11.sp)
        }
    }
}

@Composable
private fun SubjectDetailScreen(subject: Subject, onBack: () -> Unit) {
    LazyColumn(Modifier.fillMaxSize(), contentPadding = PaddingValues(18.dp), verticalArrangement = Arrangement.spacedBy(14.dp)) {
        item {
            Text("STUDY MATERIALS", color = Blue, fontSize = 11.sp, fontWeight = FontWeight.Bold, letterSpacing = 1.3.sp)
            Text(subject.name, color = Navy, fontSize = 26.sp, fontWeight = FontWeight.Bold)
            Text(subject.subtitle, color = Muted, fontSize = 13.sp)
            OutlinedButton(onClick = onBack) { Text("Back to subjects") }
        }
        item {
            Card(colors = CardDefaults.cardColors(containerColor = Color.White), shape = RoundedCornerShape(18.dp)) {
                Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(9.dp)) {
                    Text("Official syllabus", color = Navy, fontWeight = FontWeight.Bold, fontSize = 17.sp)
                    Text("The official syllabus document and topic-by-topic outline will be attached here after it is checked against the latest CSCA publication.", color = Muted, fontSize = 13.sp)
                    Text("What this page will include", color = Navy, fontWeight = FontWeight.SemiBold)
                    Bullet("Full official topic hierarchy")
                    Bullet("Subtopics and learning objectives where published")
                    Bullet("Download/open official syllabus file")
                    Bullet("Related practice resources and mock tests")
                    Bullet("Previous-year papers once provided by GL Education")
                }
            }
        }
        item {
            Card(colors = CardDefaults.cardColors(containerColor = Color(0xFFEAF2FE)), shape = RoundedCornerShape(18.dp)) {
                Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                    Text("Practice this subject", color = Navy, fontWeight = FontWeight.Bold)
                    Text("Related mock tests and assignments will appear here based on the student's course access and available exam sets.", color = Muted, fontSize = 12.sp)
                }
            }
        }
    }
}

@Composable
private fun TestsScreen(onInfo: (String) -> Unit, onExamHub: () -> Unit) {
    LazyColumn(Modifier.fillMaxSize(), contentPadding = PaddingValues(18.dp), verticalArrangement = Arrangement.spacedBy(13.dp)) {
        item {
            Text("Mock Tests", color = Navy, fontSize = 28.sp, fontWeight = FontWeight.Bold)
            Text("Practise, learn from mistakes, and follow your progress.", color = Muted, fontSize = 13.sp)
        }
        item {
            Card(colors = CardDefaults.cardColors(containerColor = Navy), shape = RoundedCornerShape(20.dp)) {
                Column(Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text("EXAM MODE", color = Gold, fontWeight = FontWeight.Bold, fontSize = 11.sp, letterSpacing = 1.2.sp)
                    Text("Prepare with timed practice", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 20.sp)
                    Text("Use mock tests to practise timing and question navigation before your official exam.", color = Color(0xFFD5E3F6), fontSize = 13.sp)
                    Button(onClick = onExamHub, colors = ButtonDefaults.buttonColors(containerColor = Color.White, contentColor = Navy)) { Text("Read exam guide") }
                }
            }
        }
        items(subjects) { subject ->
            Card(colors = CardDefaults.cardColors(containerColor = Color.White), shape = RoundedCornerShape(17.dp), border = BorderStroke(1.dp, Color(0xFFE6EBF3))) {
                Row(Modifier.padding(15.dp), verticalAlignment = Alignment.CenterVertically) {
                    Icon(subject.icon, null, tint = Blue, modifier = Modifier.size(26.dp))
                    Spacer(Modifier.width(12.dp))
                    Column(Modifier.weight(1f)) {
                        Text(subject.name, color = Navy, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                        Text("Available tests and attempt history load after backend integration", color = Muted, fontSize = 11.sp)
                    }
                    TextButton(onClick = { onInfo("Live mock-test availability, question sets, attempts, answer saving and results must be connected to the existing CSCA backend. This build does not create fake scores or claim that a test was completed.") }) { Text("Details") }
                }
            }
        }
        item {
            Text("Your test history will show total completed tests, best score, average score, accuracy, subject trends and time used once the account and exam data are connected.", color = Muted, fontSize = 12.sp)
        }
    }
}

@Composable
private fun OnlineSetupScreen(onBack: () -> Unit) {
    LazyColumn(Modifier.fillMaxSize(), contentPadding = PaddingValues(18.dp), verticalArrangement = Arrangement.spacedBy(13.dp)) {
        item {
            Text("Online Exam Environment", color = Navy, fontSize = 26.sp, fontWeight = FontWeight.Bold)
            Text("A practical preparation guide for home-based online CSCA exams.", color = Muted, fontSize = 13.sp)
            Spacer(Modifier.height(4.dp))
            Card(colors = CardDefaults.cardColors(containerColor = Color(0xFFFFF4DF)), shape = RoundedCornerShape(16.dp)) {
                Row(Modifier.padding(14.dp), verticalAlignment = Alignment.Top) {
                    Icon(Icons.Default.Info, null, tint = Color(0xFF9A5B00))
                    Spacer(Modifier.width(10.dp))
                    Text("Requirements can change by session and delivery mode. The instructions in your current official CSCA registration system, admission ticket and candidate handbook take priority.", color = Color(0xFF704800), fontSize = 12.sp)
                }
            }
        }
        item {
            GuideCard("1. Room and desk setup", listOf(
                "Choose a private, enclosed, quiet and well-lit room. Prevent other people from entering or disturbing you.",
                "Use a standard desk and chair. Do not take the exam on a bed, sofa, lap or other non-standard surface.",
                "Keep the desk clear. Prepare only items explicitly permitted by the current candidate instructions.",
                "Avoid strong backlighting; the front camera must show your face and upper body clearly."
            ))
        }
        item {
            GuideCard("2. Main computer (answering device)", listOf(
                "The published home-based guidance specifies a Windows computer and one physical monitor; macOS may not be supported by the designated client.",
                "Published guidance has listed at least 4 GB RAM, a display resolution of at least 1366 × 768, a 720p camera minimum (1080p recommended), working microphone and speakers, and free disk space for the client.",
                "Install only the designated exam client from the official registration system and complete the required system check.",
                "Keep the computer powered and connected to stable internet; wired broadband is recommended where available."
            ))
        }
        item {
            GuideCard("3. Secondary camera position", listOf(
                "Home-based online testing may require a second phone or tablet for remote monitoring; follow the instructions for your exam session.",
                "Place it securely at about a 45-degree angle to the side and slightly behind you, following the official diagram.",
                "The second camera should show your side profile, shoulders, arms, hands, desk and main computer screen.",
                "Connect it to power, close unrelated apps, enable the required quiet/Do Not Disturb settings, and verify the feed before exam time."
            ))
        }
        item {
            GuideCard("4. Network, audio and lighting check", listOf(
                "Official guidance has specified at least 20 Mbps upload and download bandwidth for home testing; check the current handbook for your session.",
                "Test both camera views, microphone, speakers and network using the official platform test.",
                "Close unrelated programs and disable notifications as instructed by the exam client.",
                "Keep a permitted backup connection ready if allowed, but do not switch devices or networks in a way that violates live exam instructions."
            ))
        }
        item {
            GuideCard("5. Identification and permitted items", listOf(
                "Prepare the original valid identification document required by your admission ticket and the printed or digital admission ticket as instructed.",
                "Do not assume ordinary paper scratch sheets are allowed. Published home-exam guidance has specified a small whiteboard and erasable marker, or a blank sheet inside a transparent document bag with an erasable marker on the bag surface.",
                "Have any permitted scratch tool inspected when asked and erase it in view of the proctor at the end.",
                "The current admission ticket and official handbook determine which identification and scratch tools are accepted."
            ))
        }
        item {
            GuideCard("6. Login and exam-day timeline", listOf(
                "Complete the official platform test and a full mock exam in advance.",
                "Log in early: official guidance has instructed candidates to arrive roughly 30–60 minutes before the scheduled start.",
                "Complete identity verification, facial recognition, camera checks, room scan and scratch-tool inspection as instructed.",
                "Read and accept the on-screen candidate declaration before starting."
            ))
        }
        item {
            GuideCard("7. Candidate rules and integrity", listOf(
                "Keep required cameras and microphone active and unobstructed throughout the exam.",
                "Do not use notes, books, unauthorized devices, wireless headphones, extra displays, screen sharing, remote access, or non-exam software where prohibited by the official rules.",
                "Do not communicate with anyone, receive outside help, record or distribute test questions, or disclose answers.",
                "Remain visible to the proctor and follow all invigilator instructions.",
                "Do not leave the exam client or end the session until the system confirms submission or the proctor instructs you."
            ))
        }
        item {
            GuideCard("8. Time, saving and technical issues", listOf(
                "Read the exam-specific duration and question count from your admission information; do not rely on generic practice-test timing.",
                "Use the official exam interface's answer status and time indicator to track progress.",
                "If a connection or device issue occurs, follow the official recovery steps and notify the proctor immediately.",
                "Wait for the successful submission confirmation. Do not assume the exam submitted merely because the timer ended."
            ))
        }
        item {
            GuideCard("9. Violations and consequences", listOf(
                "Breaking exam rules may result in a warning, cancellation of the current score, restrictions on future attempts, or other penalties under the current official policy.",
                "Exact consequences depend on the current candidate declaration and official rules; read them before test day.",
                "Never rely on a practice app's behavior as a statement of official CSCA policy."
            ))
        }
        item {
            Text("Official source: csca.cn and the current CSCA registration system. This guide summarizes published home-based online exam guidance and is not a substitute for the candidate handbook for your session.", color = Muted, fontSize = 11.sp)
        }
        item { OutlinedButton(onClick = onBack) { Text("Back to homepage") } }
    }
}

@Composable
private fun GuideCard(title: String, bullets: List<String>) {
    Card(colors = CardDefaults.cardColors(containerColor = Color.White), shape = RoundedCornerShape(18.dp), border = BorderStroke(1.dp, Color(0xFFE7ECF4))) {
        Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
            Text(title, color = Navy, fontSize = 16.sp, fontWeight = FontWeight.Bold)
            bullets.forEach { Bullet(it) }
        }
    }
}

@Composable
private fun Bullet(text: String) {
    Row(verticalAlignment = Alignment.Top, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
        Box(Modifier.padding(top = 6.dp).size(6.dp).clip(CircleShape).background(Blue))
        Text(text, color = Color(0xFF4F6077), fontSize = 12.sp, lineHeight = 18.sp, modifier = Modifier.weight(1f))
    }
}

@Composable
private fun ExamHubScreen(onBack: () -> Unit, onSetup: () -> Unit, onOfficial: () -> Unit) {
    LazyColumn(Modifier.fillMaxSize(), contentPadding = PaddingValues(18.dp), verticalArrangement = Arrangement.spacedBy(13.dp)) {
        item {
            Text("CSCA Exam Guide", color = Navy, fontSize = 27.sp, fontWeight = FontWeight.Bold)
            Text("Everything a new candidate should understand before registration and preparation.", color = Muted, fontSize = 13.sp)
        }
        item {
            Card(colors = CardDefaults.cardColors(containerColor = Navy), shape = RoundedCornerShape(20.dp)) {
                Column(Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text("CHINA SCHOLASTIC COMPETENCY ASSESSMENT", color = Sky, fontSize = 10.sp, fontWeight = FontWeight.Bold, letterSpacing = 1.sp)
                    Text("Start with the official information.", color = Color.White, fontSize = 21.sp, fontWeight = FontWeight.Bold)
                    Text("Check current exam dates, registration windows, delivery options, subject requirements and candidate notices before planning your attempt.", color = Color(0xFFD5E3F6), fontSize = 13.sp)
                    Button(onClick = onOfficial, colors = ButtonDefaults.buttonColors(containerColor = Color.White, contentColor = Navy)) {
                        Text("Open official CSCA website")
                        Spacer(Modifier.width(6.dp))
                        Icon(Icons.Default.ArrowForward, null, modifier = Modifier.size(16.dp))
                    }
                }
            }
        }
        item {
            Card(colors = CardDefaults.cardColors(containerColor = Color.White), shape = RoundedCornerShape(18.dp), border = BorderStroke(1.dp, Color(0xFFE5EAF2))) {
                Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.CalendarMonth, null, tint = Blue)
                        Spacer(Modifier.width(8.dp))
                        Column(Modifier.weight(1f)) {
                            Text("Official exam schedule", color = Navy, fontWeight = FontWeight.Bold, fontSize = 17.sp)
                            Text("Dates currently listed for 2026–2027", color = Muted, fontSize = 11.sp)
                        }
                    }
                    Text("November 14–15, 2026", color = Navy, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                    Text("Registration: October 15–21, 2026 (Beijing Time)", color = Teal, fontWeight = FontWeight.SemiBold, fontSize = 12.sp)
                    Divider(color = Color(0xFFE8EDF4))
                    Text("December 19–20, 2026 · January 23–24, 2027 · March 13–14, 2027 · April 24–25, 2027 · June 26–27, 2027", color = Ink, fontSize = 12.sp, lineHeight = 18.sp)
                    Text("Schedules and registration windows can change. Verify the session, location/format and deadline in the official portal before booking.", color = Muted, fontSize = 11.sp)
                    OutlinedButton(onClick = onOfficial, modifier = Modifier.fillMaxWidth()) {
                        Text("Verify dates on csca.cn")
                        Spacer(Modifier.width(6.dp))
                        Icon(Icons.Default.ArrowForward, null, modifier = Modifier.size(16.dp))
                    }
                }
            }
        }
        item { GuideCard("What is CSCA?", listOf(
            "CSCA stands for China Scholastic Competency Assessment, an academic assessment used in the undergraduate admission pathway for international students applying to study in China.",
            "Required subjects and score expectations can vary by intended major, university and admission cycle. Always verify requirements with the target university.",
            "Use CSCA Go for preparation and guidance; official registration, admission tickets and final exam instructions come from the official CSCA system."
        )) }
        item { GuideCard("Exam formats", listOf(
            "Depending on the available country/region and session, CSCA may offer centralized computer-based testing, paper-based testing, or home-based online testing.",
            "Availability is not necessarily a free choice. Check the official registration portal for the formats and centers available to you.",
            "The home-based online exam uses the designated exam client and may require a separate monitoring device. It is not the same as taking a normal website quiz."
        )) }
        item { GuideCard("Subject categories", listOf(
            "Mathematics — review the official Mathematics syllabus and the requirements of your intended university.",
            "Physics — required for some science, engineering and related programs according to university policy.",
            "Chemistry — required for some majors according to university policy.",
            "Professional Chinese (Humanities) — 文科中文; Chinese-language test category for humanities-oriented tracks.",
            "Professional Chinese (Science) — 理科中文; Chinese-language test category for science-oriented tracks.",
            "The exact combination of subjects, language and score use should be checked in the current official syllabus and university requirements."
        )) }
        item { GuideCard("CSCA test structure at a glance", listOf(
            "Professional Chinese (Humanities) / 文科中文: Chinese language, 90 minutes, 80 multiple-choice questions, score range 0–100.",
            "Professional Chinese (Science) / 理科中文: Chinese language, 90 minutes, 80 multiple-choice questions, score range 0–100.",
            "Mathematics: Chinese or English; 60 minutes, 48 multiple-choice questions, score range 0–100.",
            "Physics: Chinese or English; 60 minutes, 48 multiple-choice questions, score range 0–100.",
            "Chemistry: Chinese or English; 60 minutes, 48 multiple-choice questions, score range 0–100.",
            "This overview is based on the official CSCA exam introduction. Check current session guidance and target university requirements before registering."
        )) }
        item { GuideCard("Registration checklist", listOf(
            "Use the official registration website and a long-term accessible email address.",
            "Enter personal information exactly as it appears on the accepted identification document.",
            "Check exam date, delivery format, available test location, subject selection and registration deadline.",
            "Complete required payment and registration steps in the official system.",
            "Download the admission ticket when released and check every detail carefully. Incorrect or mismatched information can prevent admission."
        )) }
        item { GuideCard("Dates, registration and results", listOf(
            "Exam dates and registration windows change by session. Always check the official current schedule before booking travel or planning study time.",
            "The official schedule page is the source of truth for upcoming sessions and application windows.",
            "Result release timelines and score validity should be confirmed in the current official notices and the target university's rules."
        )) }
        item {
            Card(modifier = Modifier.fillMaxWidth().clickable(onClick = onSetup), colors = CardDefaults.cardColors(containerColor = Color(0xFFE9F2FF)), shape = RoundedCornerShape(18.dp)) {
                Row(Modifier.padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.Shield, null, tint = Blue, modifier = Modifier.size(30.dp))
                    Spacer(Modifier.width(12.dp))
                    Column(Modifier.weight(1f)) {
                        Text("Online exam environment, position setup & rules", color = Navy, fontWeight = FontWeight.Bold, fontSize = 15.sp)
                        Text("Computer, second camera, desk, network, allowed items, login, integrity rules and technical issues.", color = Muted, fontSize = 12.sp)
                    }
                    Icon(Icons.Default.ChevronRight, null, tint = Blue)
                }
            }
        }
        item { GuideCard("Preparation roadmap for new students", listOf(
            "Step 1: Identify your target major and confirm required CSCA subjects with your university.",
            "Step 2: Read the official syllabus for every required subject.",
            "Step 3: Study topic by topic and maintain a list of weak areas.",
            "Step 4: Take timed mock tests, review mistakes and monitor progress.",
            "Step 5: Complete official platform checks and a full exam simulation before test day.",
            "Step 6: Recheck the admission ticket, current exam rules, device setup and schedule."
        )) }
        item {
            Text("Content note: this is a candidate-friendly overview, not an official CSCA publication. Policies can change; use the current official website and candidate handbook for final decisions.", color = Muted, fontSize = 11.sp)
        }
        item { OutlinedButton(onClick = onBack) { Text("Back to homepage") } }
    }
}

@Composable
private fun ProfileScreen(
    profileUri: String?,
    studentName: String,
    onLogout: () -> Unit,
    onPickPhoto: () -> Unit,
    onNameChange: (String) -> Unit,
    onInfo: (String) -> Unit
) {
    var editingName by remember { mutableStateOf(false) }
    var draftName by remember(studentName) { mutableStateOf(studentName) }
    LazyColumn(Modifier.fillMaxSize(), contentPadding = PaddingValues(18.dp), verticalArrangement = Arrangement.spacedBy(14.dp)) {
        item {
            Text("Your Profile", color = Navy, fontSize = 28.sp, fontWeight = FontWeight.Bold)
            Text("Personalize your learning space.", color = Muted, fontSize = 13.sp)
        }
        item {
            Card(colors = CardDefaults.cardColors(containerColor = Color.White), shape = RoundedCornerShape(22.dp)) {
                Column(Modifier.fillMaxWidth().padding(20.dp), horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Box(Modifier.size(108.dp).clip(CircleShape).background(Color(0xFFEAF2FE)), contentAlignment = Alignment.Center) {
                        ProfileImage(profileUri = profileUri, modifier = Modifier.fillMaxSize())
                    }
                    Text(studentName, color = Navy, fontSize = 21.sp, fontWeight = FontWeight.Bold)
                    Text("CSCA Go student profile", color = Muted, fontSize = 12.sp)
                    OutlinedButton(onClick = onPickPhoto, shape = RoundedCornerShape(13.dp)) {
                        Icon(Icons.Default.PhotoCamera, null, modifier = Modifier.size(18.dp))
                        Spacer(Modifier.width(8.dp))
                        Text(if (profileUri == null) "Add profile picture" else "Change profile picture")
                    }
                    Text("Your profile photo and display name sync to your GL Education account when the server confirms the update.", color = Muted, fontSize = 11.sp)
                }
            }
        }
        item {
            Card(colors = CardDefaults.cardColors(containerColor = Color.White), shape = RoundedCornerShape(18.dp)) {
                Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Text("Basic information", color = Navy, fontWeight = FontWeight.Bold, fontSize = 17.sp)
                    Text("Name", color = Muted, fontSize = 11.sp)
                    Text(studentName, color = Ink, fontSize = 14.sp)
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        OutlinedButton(onClick = { draftName = studentName; editingName = true }) { Text("Edit display name") }
                        OutlinedButton(onClick = { onInfo("Email: use the account email registered with GL Education. Phone and password reset help are available through GL Education support if you cannot sign in.") }) { Text("Account help") }
                        Button(
                            onClick = onLogout,
                            colors = ButtonDefaults.buttonColors(containerColor = Red),
                            shape = RoundedCornerShape(12.dp),
                            modifier = Modifier.fillMaxWidth()
                        ) { Text("Sign out") }
                    }
                }
            }
        }
        item {
            Card(colors = CardDefaults.cardColors(containerColor = Color.White), shape = RoundedCornerShape(18.dp)) {
                Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text("Learning overview", color = Navy, fontWeight = FontWeight.Bold, fontSize = 17.sp)
                    ProfileStat(Icons.Default.Assignment, "Mock tests completed", "Will load from your account")
                    ProfileStat(Icons.Default.QueryStats, "Average & best score", "Calculated from completed scored tests")
                    ProfileStat(Icons.Default.School, "Enrolled courses", "Free and premium course status")
                    ProfileStat(Icons.Default.FactCheck, "Homework", "Pending, submitted and graded")
                }
            }
        }
    }
    if (editingName) {
        AlertDialog(
            onDismissRequest = { editingName = false },
            title = { Text("Display name") },
            text = {
                androidx.compose.material3.OutlinedTextField(
                    value = draftName,
                    onValueChange = { draftName = it },
                    label = { Text("Your name") },
                    singleLine = true
                )
            },
            confirmButton = {
                TextButton(onClick = {
                    val cleaned = draftName.trim()
                    if (cleaned.isNotEmpty()) onNameChange(cleaned)
                    editingName = false
                }) { Text("Save") }
            },
            dismissButton = { TextButton(onClick = { editingName = false }) { Text("Cancel") } }
        )
    }
}

@Composable
private fun ProfileStat(icon: ImageVector, title: String, value: String) {
    Row(Modifier.fillMaxWidth().padding(vertical = 4.dp), verticalAlignment = Alignment.CenterVertically) {
        Icon(icon, null, tint = Blue, modifier = Modifier.size(21.dp))
        Spacer(Modifier.width(10.dp))
        Column(Modifier.weight(1f)) {
            Text(title, color = Ink, fontWeight = FontWeight.SemiBold, fontSize = 13.sp)
            Text(value, color = Muted, fontSize = 11.sp)
        }
    }
}

@Composable
private fun ProfileImage(profileUri: String?, modifier: Modifier = Modifier) {
    val context = LocalContext.current
    val bitmap by androidx.compose.runtime.produceState<androidx.compose.ui.graphics.ImageBitmap?>(
        initialValue = null,
        key1 = profileUri
    ) {
        value = withContext(Dispatchers.IO) {
            try {
                if (profileUri.isNullOrBlank()) null
                else {
                    val stream = if (profileUri.startsWith("https://") || profileUri.startsWith("http://")) {
                        URL(profileUri).openConnection().apply {
                            connectTimeout = 8000
                            readTimeout = 10000
                        }.getInputStream()
                    } else {
                        context.contentResolver.openInputStream(Uri.parse(profileUri))
                    }
                    stream?.use { BitmapFactory.decodeStream(it)?.asImageBitmap() }
                }
            } catch (_: Exception) {
                null
            }
        }
    }
    if (bitmap != null) {
        Image(bitmap = bitmap!!, contentDescription = "Student profile picture", modifier = modifier, contentScale = ContentScale.Crop)
    } else {
        Box(modifier, contentAlignment = Alignment.Center) {
            Icon(Icons.Default.AccountCircle, contentDescription = "Student profile placeholder", tint = Blue, modifier = Modifier.fillMaxSize(0.88f))
        }
    }
}
