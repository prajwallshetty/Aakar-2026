import { Montserrat, Cinzel } from 'next/font/google'

export const baseFont = Montserrat({
    subsets: ['latin'],
    variable: '--font-base',
})

export const cinzelFont = Cinzel({
    subsets: ['latin'],
    variable: '--font-heading',
    weight: ['400', '600', '700'],
})