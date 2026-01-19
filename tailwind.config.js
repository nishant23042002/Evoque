/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: "class",
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                /* -------------------------------- */
                /* BRAND                            */
                /* -------------------------------- */
                brand: {
                    DEFAULT: "#C1121F", // Deep Brick
                    dark: "#9B0D18",
                    light: "#F5E6E8",
                },

                /* -------------------------------- */
                /* LINEN NEUTRALS                   */
                /* -------------------------------- */
                linen: {
                    50: "#FAF9F6",
                    100: "#F4F1EC",
                    200: "#EEE9E1",
                    300: "#D8D2C8",
                    400: "#B8B2A8",
                    500: "#8A847B",
                    600: "#6F6A62",
                    700: "#4A4A4A",
                    800: "#2C2C2C",
                    900: "#1E1E1E",
                },

                /* -------------------------------- */
                /* NATURAL ACCENTS                  */
                /* -------------------------------- */
                accent: {
                    olive: "#6B7C59",
                    sage: "#8FA48B",
                    clay: "#9B7E6A",
                    sand: "#E3D7C6",
                },
            },

            /* -------------------------------- */
            /* TYPOGRAPHY                       */
            /* -------------------------------- */
            fontFamily: {
                poppins: ["Poppins", "sans-serif"],
            },

            /* -------------------------------- */
            /* RADIUS                           */
            /* -------------------------------- */
            borderRadius: {
                sm: "0.375rem",
                md: "0.625rem",
                lg: "0.875rem",
                xl: "1.125rem",
            },

            /* -------------------------------- */
            /* SHADOWS (SOFT, PREMIUM)          */
            /* -------------------------------- */
            boxShadow: {
                soft: "0 2px 6px rgba(44,44,44,0.04)",
                medium: "0 6px 16px rgba(44,44,44,0.06)",
                strong: "0 10px 28px rgba(44,44,44,0.1)",
                card: "0 4px 12px rgba(44,44,44,0.06)",
            },
        },
    },
    plugins: [],
};
