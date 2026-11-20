import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { Flip } from 'gsap/Flip'
import { CustomEase } from 'gsap/CustomEase'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, SplitText, Flip, CustomEase, useGSAP)
CustomEase.create('cine', '0.76, 0, 0.24, 1')
CustomEase.create('out-expo', '0.16, 1, 0.3, 1')

export { gsap, ScrollTrigger, SplitText, Flip, useGSAP }
