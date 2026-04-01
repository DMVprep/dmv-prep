import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('new-hampshire', 'spanish') }
export default function Page() { return <LanguagePracticePage stateSlug="new-hampshire" language="spanish" /> }