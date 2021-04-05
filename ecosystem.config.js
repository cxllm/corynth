module.exports = {
    apps: [{
        name: 'Corynth',
        script: './dist/index.js',
        autorestart: true,
        watch: false
    },
    {
        name: 'CorynthWebsite',
        script: './Website/index.js',
        autorestart: true,
        watch: false
    }],
};