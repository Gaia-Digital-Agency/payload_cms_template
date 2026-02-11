import nextVitals from 'eslint-config-next/core-web-vitals'

const config = [
  ...nextVitals,
  { ignores: ['.pnpm-store/**'] },
]

export default config
