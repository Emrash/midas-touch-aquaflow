import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Enhanced color palette for Midas Touch
				mdpc: {
					brown: {
						lightest: '#F5EFE6',
						light: '#D5BFA9',
						DEFAULT: '#8B6E4F',
						dark: '#513A1F',
						darkest: '#2C1E0F',
					},
					blue: {
						lightest: '#D4E9F7',
						light: '#81C3D7',
						DEFAULT: '#3A7CA5',
						dark: '#2A5978',
						darkest: '#1A3C54',
					},
					gold: {
						lightest: '#FFF8E1',
						light: '#F5E7A3',
						DEFAULT: '#D4AF37',
						dark: '#B7972A',
						darkest: '#8A6E17',
					},
					earth: {
						lightest: '#F8F5F0',
						light: '#E5DED3',
						DEFAULT: '#B5A99A',
						dark: '#7D7269',
						darkest: '#4A433D',
					},
					// New accent colors for premium design
					slate: {
						light: '#E3E8ED',
						DEFAULT: '#64748B',
						dark: '#334155',
					},
					emerald: {
						light: '#D1FAE5',
						DEFAULT: '#059669',
						dark: '#065F46',
					},
					amber: {
						light: '#FEF3C7',
						DEFAULT: '#D97706',
						dark: '#92400E',
					}
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			fontFamily: {
				sans: ['DM Sans', 'sans-serif'],
				heading: ['Playfair Display', 'serif'],
			},
			boxShadow: {
				'premium': '0 10px 30px -10px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
				'premium-hover': '0 20px 40px -15px rgba(0, 0, 0, 0.15), 0 10px 20px -5px rgba(0, 0, 0, 0.1)',
				'premium-inner': 'inset 0 2px 6px -2px rgba(0, 0, 0, 0.1)',
				'gold-glow': '0 0 15px rgba(212, 175, 55, 0.5)',
				'blue-glow': '0 0 15px rgba(58, 124, 165, 0.5)',
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'water-flow': {
					'0%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-5px)' },
					'100%': { transform: 'translateY(0)' }
				},
				'drill-down': {
					'0%': { transform: 'translateY(0) rotate(0deg)' },
					'50%': { transform: 'translateY(10px) rotate(2deg)' },
					'100%': { transform: 'translateY(0) rotate(0deg)' }
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-in-left': {
					'0%': { opacity: '0', transform: 'translateX(-20px)' },
					'100%': { opacity: '1', transform: 'translateX(0)' }
				},
				'fade-in-right': {
					'0%': { opacity: '0', transform: 'translateX(20px)' },
					'100%': { opacity: '1', transform: 'translateX(0)' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'float-slow': {
					'0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
					'25%': { transform: 'translateY(-5px) rotate(-1deg)' },
					'75%': { transform: 'translateY(5px) rotate(1deg)' },
					'50%': { transform: 'translateY(-10px) rotate(0deg)' }
				},
				'spin-slow': {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(360deg)' }
				},
				'ripple': {
					'0%': { transform: 'scale(0)', opacity: '0.5' },
					'100%': { transform: 'scale(6)', opacity: '0' }
				},
				'shimmer': {
					'0%': { backgroundPosition: '-100% 0' },
					'100%': { backgroundPosition: '200% 0' }
				},
				'pulse-glow': {
					'0%, 100%': { opacity: '0.8', boxShadow: '0 0 5px rgba(212, 175, 55, 0.5)' },
					'50%': { opacity: '1', boxShadow: '0 0 20px rgba(212, 175, 55, 0.8)' }
				},
				'scale-up': {
					'0%': { transform: 'scale(0.95)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'scale-down': {
					'0%': { transform: 'scale(1.05)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'water-flow': 'water-flow 3s ease-in-out infinite',
				'drill-down': 'drill-down 2.5s ease-in-out infinite',
				'fade-in': 'fade-in 0.8s ease-out',
				'fade-in-left': 'fade-in-left 0.8s ease-out',
				'fade-in-right': 'fade-in-right 0.8s ease-out',
				'float': 'float 5s ease-in-out infinite',
				'float-slow': 'float-slow 8s ease-in-out infinite',
				'spin-slow': 'spin-slow 8s linear infinite',
				'ripple': 'ripple 1.5s ease-out forwards',
				'shimmer': 'shimmer 2.5s infinite',
				'pulse-glow': 'pulse-glow 3s infinite',
				'scale-up': 'scale-up 0.4s ease-out',
				'scale-down': 'scale-down 0.4s ease-out'
			},
			backgroundImage: {
				'hero-pattern': "url('/placeholder.svg')",
				'water-texture': "linear-gradient(109.6deg, rgba(223,234,247,1) 11.2%, rgba(244,248,252,1) 91.1%)",
				'earth-texture': "linear-gradient(to right, #d7d2cc 0%, #304352 100%)",
				'gold-gradient': "linear-gradient(to top, #e6b980 0%, #eacda3 100%)",
				'blue-gradient': "linear-gradient(135deg, #81C3D7 0%, #3A7CA5 100%)",
				'premium-gradient': "linear-gradient(135deg, #D4AF37 0%, #F5E7A3 50%, #D4AF37 100%)",
				'dark-gradient': "linear-gradient(to right, #2C1E0F 0%, #513A1F 100%)",
				'water-flow': "linear-gradient(to right, #3A7CA5 0%, #81C3D7 50%, #3A7CA5 100%)"
			},
			skew: {
				// Add custom skew values if needed
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
