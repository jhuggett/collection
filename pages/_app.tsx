import "../styles.css";
import dynamic from "next/dynamic";
import { TinaEditProvider } from "tinacms/dist/edit-state";
const TinaCMS = dynamic(() => import("tinacms"), { ssr: false });
import { TinaCloudCloudinaryMediaStore } from "next-tinacms-cloudinary";
import { createGlobalStyle } from "styled-components";

const NEXT_PUBLIC_TINA_CLIENT_ID = process.env.NEXT_PUBLIC_TINA_CLIENT_ID;
const NEXT_PUBLIC_USE_LOCAL_CLIENT =
  process.env.NEXT_PUBLIC_USE_LOCAL_CLIENT || 0;

const App = ({ Component, pageProps }) => {
  return (
    <>
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

    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  }
  html, body, #__next {
    height: 100%;
    width: 100%;
    overflow-x: hidden;
  }
  /* width */
  ::-webkit-scrollbar {
    width: .5em;
  }
  /* Track */
  ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 1px grey;
  }
  /* Handle */
  ::-webkit-scrollbar-thumb {
    border-radius: 1em;
    opacity: .5;
  }
`

export default App;
