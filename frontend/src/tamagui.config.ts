import { createTamagui } from 'tamagui'
import { config as tamaguiConfig } from '@tamagui/config' // Hapus "/v4"

const config = createTamagui(tamaguiConfig)

export type AppConfig = typeof config
declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config
