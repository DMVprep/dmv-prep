import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('connecticut', 'chinese') }
export default function Page() { return <LanguagePracticePage stateSlug="connecticut" language="chinese" /> }
