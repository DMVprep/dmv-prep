import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('kansas', 'haitian-creole') }
export default function Page() { return <LanguagePracticePage stateSlug="kansas" language="haitian-creole" /> }
