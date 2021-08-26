import { getStaticPropsForTina, staticRequest } from "tinacms";
import type { ItemDocument } from "../../.tina/__generated__/types";
import FourOhFour from "../404";
import Markdown from "react-markdown";

export default function Item(props: AsyncReturnType<typeof getStaticProps>["props"]) {


  const data = props.data.getItemDocument.data

  console.log({data});
  

  return <>
    <a href={'/items'}>Back</a>
    <h1>
      {data.name}
    </h1>
    <h3>Made in {data.year}</h3>
    {data.images?.map((src) => (
      <img src={src} />
    ))}
    <Markdown>{data.description}</Markdown>
  </>
}

export const getStaticProps = async ({ params }) => {
  const tinaProps = (await getStaticPropsForTina({
    query: `#graphql
      query Query($relativePath: String!) {
        getItemDocument(relativePath: $relativePath) {
          data {
            name
            year
            images
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
