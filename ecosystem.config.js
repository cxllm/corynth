module.exports = {
    apps: [{
        name: 'Corynth',
        script: 'index.js',
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