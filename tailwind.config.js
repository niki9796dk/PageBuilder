/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "index.html",
        "./src/**/*.{html,js,ts,tsx,jsx}"
    ],
    theme: {
        extend: {
            colors: {
                background: '#fffffe',
                headline: '#2b2c34',
                paragraph: '#2b2c34',
                button: '#6246ea',
                buttonText: '#fffffe',
                stroke: '#2b2c34',
                main: '#fffffe',
                highlight: '#6246ea',
                secondary: '#d1d1e9',
                tertiary: '#e45858',
                purple: 'rgba(98, 70, 234, 0.65)'
            },
            boxShadow: {
                'dynamic-stroke': 'rgba(98, 70, 234, 0.4) 0px 0px 0px 2px, rgba(98, 70, 234, 0.65) 0px 4px 6px -2px',
            }
        },
    },
    plugins: [],
}
