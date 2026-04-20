/** @type {import('next').NextConfig} */
const { PHASE_PRODUCTION_BUILD, PHASE_EXPORT } = require('next/constants')

const mode = process.env.NEXT_PUBLIC_BUILD_MODE
const basePath = process.env.EXPORT_BASE_PATH || ''

/** @type {(phase: string, defaultConfig: import("next").NextConfig) => Promise<import("next").NextConfig>} */
module.exports = async (phase) => {
  const nextConfig = {
    images: {
      unoptimized: mode === 'export',
    },
    reactStrictMode: false,
  }

  if (mode === 'export') {
    nextConfig.output = 'export'
    nextConfig.basePath = basePath
  } else if (mode === 'standalone') {
    nextConfig.output = 'standalone'
  }

  // 如果是生产环境或导出模式，使用 Serwist
  if (phase === PHASE_PRODUCTION_BUILD || phase === PHASE_EXPORT) {
    const withSerwist = (await import('@serwist/next')).default({
      swSrc: 'app/sw.ts',
      swDest: 'public/sw.js',
      register: false,
    })
    return withSerwist(nextConfig)
  }

  return nextConfig
}
