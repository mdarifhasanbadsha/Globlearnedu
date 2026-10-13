package com.globlearnedu.cscago

/**
 * Public service URLs used by the native app.
 *
 * These URLs expose only public API routes. Never package database credentials,
 * mail-provider keys, API tokens, or other server-only secrets in the APK.
 * Account operations use a bearer session issued by the CSCA Go auth API.
 */
object ApiConfig {
    const val WEBSITE_BASE_URL = "https://globlearnedu.com"
    const val MOBILE_AUTH_URL = "https://globlearnedu.com/api/csca-go/auth"
    const val MOBILE_PROFILE_URL = "https://globlearnedu.com/api/csca-go/profile"
    const val MOCK_TEST_URL = "https://globlearnedu.com/api/csca/mocktest"

    const val OFFICIAL_CSCA_URL = "https://csca.cn/"
    const val OFFICIAL_CSCA_SCHEDULE_URL = "https://csca.cn/registration/notice/jjwk"
    const val OFFICIAL_CSCA_EXAM_INFO_URL = "https://csca.cn/about/examintro"
}
