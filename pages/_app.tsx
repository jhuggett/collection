import dynamic from "next/dynamic";
import { TinaEditProvider } from "tinacms/dist/edit-state";
const TinaCMS = dynamic(() => import("tinacms"), { ssr: false });
import { TinaCloudCloudinaryMediaStore } from "next-tinacms-cloudinary";
import { createGlobalStyle } from "styled-components";
import Head from 'next/head'

const NEXT_PUBLIC_TINA_CLIENT_ID = process.env.NEXT_PUBLIC_TINA_CLIENT_ID;
const NEXT_PUBLIC_USE_LOCAL_CLIENT =
  process.env.NEXT_PUBLIC_USE_LOCAL_CLIENT || 0;

const App = ({ Component, pageProps }) => {
  return (
    <>
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
              
                <Component {...livePageProps} />
            )}
          </TinaCMS>
        }
      >
          <Component {...pageProps} />
        
      </TinaEditProvider>
    </>
  );
};


const GlobalTheme = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
    font-size: 1.15em;
  }
  html, body, #__next {
    height: 100%;
    width: 100%;
    overflow-x: hidden;
    --tina-color-primary-light: Black;
    --tina-color-primary: Black;
    --tina-color-primary-dark: Black;
  }
`

export default App;
