package com.globlearnedu.cscaexam

import android.annotation.SuppressLint
import android.app.AlertDialog
import android.content.Intent
import android.graphics.Color
import android.net.Uri
import android.os.Bundle
import android.view.View
import android.view.WindowManager
import android.webkit.CookieManager
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.FrameLayout
import android.widget.ProgressBar
import android.widget.TextView
import android.view.Gravity
import androidx.activity.ComponentActivity

class MainActivity : ComponentActivity() {
    private lateinit var webView: WebView
    private lateinit var progress: ProgressBar
    private lateinit var status: TextView
    private var lastExamUrl: String = START_URL
    private var backDialogVisible = false

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        window.setFlags(
            WindowManager.LayoutParams.FLAG_SECURE,
            WindowManager.LayoutParams.FLAG_SECURE
        )
        window.statusBarColor = Color.rgb(7, 26, 53)
        window.navigationBarColor = Color.rgb(7, 26, 53)
        window.decorView.systemUiVisibility = 0

        val root = FrameLayout(this).apply { setBackgroundColor(Color.rgb(7, 26, 53)) }
        webView = WebView(this).apply {
            setBackgroundColor(Color.WHITE)
            settings.javaScriptEnabled = true
            settings.domStorageEnabled = true
            settings.databaseEnabled = true
            settings.allowFileAccess = false
            settings.allowContentAccess = false
            settings.javaScriptCanOpenWindowsAutomatically = false
            settings.setSupportMultipleWindows(false)
            settings.mediaPlaybackRequiresUserGesture = true
            CookieManager.getInstance().setAcceptCookie(true)
            CookieManager.getInstance().setAcceptThirdPartyCookies(this, false)
            webChromeClient = WebChromeClient()
            webViewClient = object : WebViewClient() {
                override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean {
                    val uri = request.url
                    if (isAllowedCscaUrl(uri)) return false
                    // Keep the exam inside the app; do not open arbitrary external pages.
                    showMessage("This app only supports the GL Education CSCA section.")
                    return true
                }

                override fun onPageStarted(view: WebView, url: String, favicon: android.graphics.Bitmap?) {
                    super.onPageStarted(view, url, favicon)
                    if (isAllowedCscaUrl(Uri.parse(url))) lastExamUrl = url
                    progress.visibility = View.VISIBLE
                    status.visibility = View.GONE
                }

                override fun onPageFinished(view: WebView, url: String) {
                    super.onPageFinished(view, url)
                    progress.visibility = View.GONE
                }

                override fun onReceivedError(
                    view: WebView,
                    request: WebResourceRequest,
                    error: android.webkit.WebResourceError
                ) {
                    super.onReceivedError(view, request, error)
                    if (request.isForMainFrame) {
                        progress.visibility = View.GONE
                        status.text = "Connection interrupted. Check your internet and tap to retry."
                        status.visibility = View.VISIBLE
                    }
                }
            }
        }
        progress = ProgressBar(this).apply {
            isIndeterminate = true
            visibility = View.GONE
        }
        status = TextView(this).apply {
            text = "Connection interrupted. Check your internet and tap to retry."
            setTextColor(Color.WHITE)
            textSize = 16f
            gravity = Gravity.CENTER
            setPadding(40, 40, 40, 40)
            visibility = View.GONE
            setOnClickListener { webView.loadUrl(lastExamUrl) }
        }
        root.addView(webView, FrameLayout.LayoutParams(-1, -1))
        root.addView(progress, FrameLayout.LayoutParams(96, 96, Gravity.CENTER))
        root.addView(status, FrameLayout.LayoutParams(-1, -1))
        setContentView(root)

        if (savedInstanceState != null) {
            webView.restoreState(savedInstanceState)
        } else {
            webView.loadUrl(START_URL)
        }
    }

    private fun isAllowedCscaUrl(uri: Uri): Boolean {
        val host = uri.host?.lowercase() ?: return false
        val path = uri.path ?: "/"
        val allowedHost = host == "globlearnedu.com" || host == "www.globlearnedu.com"
        return allowedHost && (path == "/csca" || path.startsWith("/csca/"))
    }

    private fun showMessage(message: String) {
        AlertDialog.Builder(this)
            .setTitle("GL CSCA Exam")
            .setMessage(message)
            .setPositiveButton("OK", null)
            .show()
    }

    override fun onBackPressed() {
        if (backDialogVisible) return
        backDialogVisible = true
        AlertDialog.Builder(this)
            .setTitle("Leave the exam?")
            .setMessage("Going back may interrupt your mock test. If you are taking an exam, choose Stay in exam.")
            .setNegativeButton("Stay in exam") { dialog, _ -> dialog.dismiss() }
            .setPositiveButton("Leave CSCA page") { dialog, _ ->
                dialog.dismiss()
                if (webView.canGoBack()) webView.goBack() else webView.loadUrl(START_URL)
            }
            .setOnDismissListener { backDialogVisible = false }
            .show()
    }

    override fun onPause() {
        super.onPause()
        // WebView's page-level exam recovery remains responsible for saving answers.
        webView.onPause()
    }

    override fun onResume() {
        super.onResume()
        webView.onResume()
    }

    override fun onSaveInstanceState(outState: Bundle) {
        webView.saveState(outState)
        super.onSaveInstanceState(outState)
    }

    override fun onDestroy() {
        webView.stopLoading()
        webView.destroy()
        super.onDestroy()
    }

    companion object {
        private const val START_URL = "https://globlearnedu.com/csca/mocktest/mathematics"
    }
}
