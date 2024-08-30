import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
} from '@microsoft/sp-property-pane'
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base'
import * as React from 'react'
import * as ReactDom from 'react-dom'
import Birthdays from './components/Birthdays'
import { IBirthdaysProps } from './components/IBirthdaysProps'

export interface IBirthdaysWebPartProps {
  description: string
}

export default class BirthdaysWebPart extends BaseClientSideWebPart<IBirthdaysWebPartProps> {
  public render(): void {
    const element: React.ReactElement<IBirthdaysProps> = React.createElement(
      Birthdays,
      {
        siteUrl: this.context.pageContext.web.absoluteUrl,
        spHttpClient: this.context.spHttpClient,
        currentUser: this.context.pageContext,
      }
    )

    ReactDom.render(element, this.domElement)
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement)
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: 'Birthdays WebPart Configuration',
          },
          groups: [
            {
              groupName: 'Settings',
              groupFields: [
                PropertyPaneTextField('description', {
                  label: 'Description',
                }),
              ],
            },
          ],
        },
      ],
    }
  }
}
