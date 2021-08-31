import dynamic from "next/dynamic";
import { TinaEditProvider } from "tinacms/dist/edit-state";
const TinaCMS = dynamic(() => import("tinacms"), { ssr: false });
import { TinaCloudCloudinaryMediaStore } from "next-tinacms-cloudinary";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import Head from 'next/head'
import { useState, useEffect } from "react";

const NEXT_PUBLIC_TINA_CLIENT_ID = process.env.NEXT_PUBLIC_TINA_CLIENT_ID;
const NEXT_PUBLIC_USE_LOCAL_CLIENT =
  process.env.NEXT_PUBLIC_USE_LOCAL_CLIENT || 0;


const themes = {
  light: {
    name: 'light',
    background: 'white',
    primary: 'black',
    tina: {
      primary: 'red'
    }
  },
  dark: {
    name: 'dark',
    background: 'black',
    primary: 'white',
    tina: {
      primary: 'red'
    }
  }
}

const themeKey = 'theme'

const App = ({ Component, pageProps }) => {

  const [theme, setTheme] = useState(themes.light)

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(themeKey)
    if (storedTheme) {
      setTheme(themes[storedTheme])
    }
  })

  const themeConfig = {
    getTheme: () => theme,
    toggleTheme: () => {
      if (theme.name == themes.light.name) {
        window.localStorage.setItem(themeKey, themes.dark.name)
        setTheme(themes.dark)
      } else {
        window.localStorage.setItem(themeKey, themes.light.name)
        setTheme(themes.light)
      }
    }
  }

  return (
    <ThemeProvider theme={theme} >
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
      </Head>
      <GlobalTheme />
      <TinaEditProvider
        showEditButton={false}
        editMode={
          <TinaCMS
            branch="main"
            clientId={NEXT_PUBLIC_TINA_CLIENT_ID}
            isLocalClient={Boolean(Number(NEXT_PUBLIC_USE_LOCAL_CLIENT))}
            mediaStore={TinaCloudCloudinaryMediaStore}
            cmsCallback={(cms) => {
              import("react-tinacms-editor").then(({ MarkdownFieldPlugin }) => {
                cms.plugins.add(MarkdownFieldPlugin);
              });
            }}
            documentCreatorCallback={{
              /**
               * After a new document is created, redirect to its location
               */
              onNewDocument: ({ collection: { slug }, breadcrumbs }) => {
                let addSlug = slug == "page" ? '' : `/${slug}`
                if (addSlug == '/item') addSlug = '/items'
                const relativeUrl = `${addSlug}/${breadcrumbs.join("/")}`;
                return (window.location.href = relativeUrl);
              },
              /**
               * Only allows documents to be created to the `Blog Posts` Collection
               */
              filterCollections: (options) => {
                return options
              },
            }}
            /**
             * Treat the Global collection as a global form
             */
            formifyCallback={({ formConfig, createForm, createGlobalForm }) => {
              if (formConfig.id === "getGlobalDocument") {
                return createGlobalForm(formConfig);
              }

              return createForm(formConfig);
            }}
            {...pageProps}
          >
            {(livePageProps) => (
              
                <Component themeConfig={themeConfig} {...livePageProps} />
            )}
          </TinaCMS>
        }
      >
          <Component themeConfig={themeConfig} {...pageProps} />
        
      </TinaEditProvider>
    </ThemeProvider>
  );
};


const GlobalTheme = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
    font-size: 1.15em;

    background: ${props => props.theme.background};
    color: ${p => p.theme.primary};
  }
  html, body, #__next {
    height: 100%;
    width: 100%;
    overflow-x: hidden;
    --tina-color-primary-light: ${p => p.theme.tina.primary};;
    --tina-color-primary: ${p => p.theme.tina.primary};;
    --tina-color-primary-dark: ${p => p.theme.tina.primary};;
  }
`

export default App;
