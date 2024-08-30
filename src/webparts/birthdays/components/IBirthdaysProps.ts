import { SPHttpClient } from '@microsoft/sp-http'
import { PageContext } from '@microsoft/sp-page-context' // Import the PageContextUser interface

export interface IBirthdaysProps {
  siteUrl: string
  spHttpClient: SPHttpClient
  currentUser: PageContext
}
