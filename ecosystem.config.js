module.exports = {
    apps: [{
        name: 'Corynth',
        script: 'npm start',
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