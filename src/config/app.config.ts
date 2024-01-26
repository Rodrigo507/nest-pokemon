export const AppConfigEnv = () => ({
    mongodb: process.env.MONGODB,
    port: process.env.PORT || 3001,
    defaulLimit: +process.env.DEFAULT_LIMIT || 3,

})