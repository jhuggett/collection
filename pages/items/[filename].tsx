import { getStaticPropsForTina, staticRequest } from "tinacms";
import type { ItemDocument } from "../../.tina/__generated__/types";
import FourOhFour from "../404";
import Markdown from "react-markdown";
import { useRouter } from "next/router";
import styled from "styled-components"

export default function Item(props: AsyncReturnType<typeof getStaticProps>["props"]) {
  const data = props.data.getItemDocument.data
  const router = useRouter()
  
  return <> 
  <BackButton onClick={() => router.back()}>Back</BackButton>
  <Page>  
    <h1>
      {data.name}
    </h1>
    <h2>From {data.made}</h2>
    <h3>Found in {data.found?.where}, {data.found?.when}</h3>
    <Markdown>{data.description}</Markdown>
    {data.images?.map((image) => (
      <Image src={image.myImage} />
    ))}
  </Page>
  </>
}

const Page = styled.div`
  text-align: center;
`

const Image = styled.img`
  max-width: 100%;

`

const BackButton = styled.div`
  font-size: 1.75em;
  margin: 1em 0 0 1em;
  padding: .5em .5em .5em .5em;
  border-radius: 15%;
  width: fit-content;
  transition-duration: .25s;
  &:hover {
    box-shadow: 0px 0px 10px #888888;
    cursor: pointer;
  }
`

export const getStaticProps = async ({ params }) => {
  const tinaProps = (await getStaticPropsForTina({
    query: `#graphql
      query Query($relativePath: String!) {
        getItemDocument(relativePath: $relativePath) {
          data {
            name
            made
            images {
              myImage
            }
            found {
              when
              where
            }
            description
          }
        }
      }
    `,
    variables: {
      relativePath: `${params.filename}.md`
    }
  })) as { data: { getItemDocument: ItemDocument }}

  return {
    props: {
      ...tinaProps
    }
  }
}

export const getStaticPaths = async () => {
  const itemListData = (await staticRequest({
    query: `#graphql
        {
          getItemList {
          edges {
            node {
            sys { 
                filename
              }
            }
          }
        }
      }
    `,
  })) as any;
  
  return {
    paths: itemListData.getItemList.edges.map((page) => ({
      params: { filename: page.node.sys.filename },
    })),
    fallback: 'blocking',
  };
}

export type AsyncReturnType<T extends (...args: any) => Promise<any>> =
  T extends (...args: any) => Promise<infer R> ? R : any;
