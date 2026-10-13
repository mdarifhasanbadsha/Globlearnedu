package com.globlearnedu.cscago

/**
 * Integration boundary for the existing Globlearnedu platform.
 *
 * Keep the public website UI and routes unchanged. Do not place database credentials,
 * service-role keys, or private API secrets in the Android client.
 *
 * Before enabling live data, audit the current API/auth schema and implement a server-side
 * adapter. Never infer endpoints from page URLs or access the database directly from Android.
 */
object ApiConfig {
    const val WEBSITE_BASE_URL = "https://globlearnedu.com"
    const val OFFICIAL_CSCA_URL = "https://csca.cn/"
    const val OFFICIAL_CSCA_SCHEDULE_URL = "https://csca.cn/"

    // Intentionally null until the backend audit confirms a stable, authorized API contract.
    val API_BASE_URL: String? = null
}
