const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      spacing: {
        '9/16': '56.25%',
      },
      lineHeight: {
        11: '2.75rem',
        12: '3rem',
        13: '3.25rem',
        14: '3.5rem',
      },
      fontFamily: {
        sans: ['InterVariable', ...defaultTheme.fontFamily.sans],
      },
      backgroundImage: {
        'cover-gradient':
          'linear-gradient(180deg,transparent 0,rgba(0,0,0,.15) 70%,rgba(0,0,0,.5))',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            a: {
              color: theme('colors.purple.500'),
              '&:hover': {
                color: `${theme('colors.purple.400')} !important`,
              },
              code: { color: theme('colors.purple.400') },
            },
            pre: {
              backgroundColor: theme('colors.gray.900'),
              border: `1px solid ${theme('colors.gray.700')}`,
            },
            'code::before': {
              content: 'none'
            },
            'code::after': {
              content: 'none'
            },
            code: {
              color: `${theme('colors.gray.50')} !important`,
              backgroundColor: theme('colors.gray.900'),
              borderRadius: '0.25rem',
              padding: '0.25rem',
            },
          },
        },
      }),
    },
  },
  corePlugins: {
    aspectRatio: false,
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@catppuccin/tailwindcss', {
      defaultFlavour: 'mocha',
    }),
    require('@tailwindcss/aspect-ratio'),
  ],
  content: [
    './staticfy/templates/*.tmpl',
    '../vicchi.org/site/pages/**/*.md',
    '../vicchi.org/site/posts/**/*.md',
    '../vicchi.org/site/public/**/*.html'
  ]
}
