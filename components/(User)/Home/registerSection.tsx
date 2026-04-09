import { Montserrat } from 'next/font/google'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { 
  AnimeParticleField, 
  AnimeOrbField, 
  AnimeCardWrapper, 
  AnimeSectionHeading, 
  AnimeGlitchText,
  ANIME_GLOBAL_STYLES,
  ANIME_COLORS
} from "@/components/(User)/AnimeTheme/AnimeThemeComponents";

const montserrat = Montserrat({ subsets: ['latin'], weight: '400' })

const RegisterSection = () => {
    return (
        <section className="flex items-center justify-center text-white px-6 pt-16 relative">
            <style>{ANIME_GLOBAL_STYLES}</style>
            
            {/* Anime Background */}
            <AnimeOrbField />
            <AnimeParticleField />
            
            <div className="text-center max-w-3xl relative z-10">
                <AnimeCardWrapper accentIndex={0} style={{ padding: "2rem 3rem", marginBottom: "2rem" }}>
                    <AnimeSectionHeading index={0}>Join the Guild</AnimeSectionHeading>
                </AnimeCardWrapper>

                <p className={`text-xl md:text-2xl py-6 ${montserrat.className}`} style={{ color: ANIME_COLORS.text }}>
                    Don't sit on the sidelines like an NPC!
                    <br />
                    Join the quest and be part of the saga!
                    <br />
                    All UG and PG students can enter the arena.
                    <span className="inline-block align-middle ml-2">
                        <Image
                            className="w-[100px] h-auto inline-block"
                            src="/new_logo.png"
                            width={100}
                            height={100}
                            alt="Aakar Logo"
                        />
                    </span>
                </p>

                <Link href="/register">
                    <AnimeCardWrapper accentIndex={1} style={{ display: "inline-block" }}>
                        <Button 
                            size="lg" 
                            style={{ 
                                background: `${ANIME_COLORS.primary}15`,
                                border: `1px solid ${ANIME_COLORS.primary}40`,
                                boxShadow: `0 0 10px ${ANIME_COLORS.primary}20`,
                                color: ANIME_COLORS.text,
                            }}
                        >
                            <AnimeGlitchText text="Join Now">
                                Join Now
                            </AnimeGlitchText>
                        </Button>
                    </AnimeCardWrapper>
                </Link>
            </div>
        </section>
    )
}

export default RegisterSection