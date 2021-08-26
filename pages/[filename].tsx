import { getStaticPropsForTina, staticRequest } from "tinacms";
import { ItemDocument } from "../.tina/__generated__/types";
import { useEffect } from "react";

export default function index(props) {

  // just redirecting to /items for now
  useEffect(() => {
    window.location.href = '/items'
  })
  

const data = props.data?.getPageDocument?.data

if (!data) return (
  <>
  Missing data!
  </>
)

console.log({data});


  return (
  <div>
    <h1>{data.title}</h1>
    <p>{data.body}</p>
  </div>
  )
}


export const getStaticProps = async ({ params }) => {
  const path = params.filename == 'home' ? 'index' : params.filename
  
  const tinaProps = (await getStaticPropsForTina({
    query: `#graphql
      query Query($relativePath: String!) {
        getPageDocument(relativePath: $relativePath) {
          data {
            title,
            body
          }
        }
      }
    `,
    variables: { relativePath: `${path}.md` },
  })) as { data: { getPostsDocument: ItemDocument } };
  return {
    props: {
      ...tinaProps,
    },
  };
};

export const getStaticPaths = async () => {
  const pageListData = (await staticRequest({
    query: `#graphql
        {
          getPageList {
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
    paths: pageListData.getPageList.edges.map((page) => ({
      params: { filename: page.node.sys.filename },
    })),
    fallback: 'blocking',
  };
};