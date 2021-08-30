import { getStaticPropsForTina, staticRequest } from "tinacms";
import { ItemDocument } from "../.tina/__generated__/types";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function index(props) {
  const router = useRouter()

  // just redirecting to /items for now
  useEffect(() => {
    router.push('/items')
  })
  
  const data = props.data?.getPageDocument?.data

  if (!data) return (
    <>
    Missing data!
    </>
  )

    return (
    <div>
      <h1>{data.title}</h1>
      <p>{data.body}</p>
    </div>
    )
}


export const getStaticProps = async ({ params }) => {
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
    variables: { relativePath: `${params.filename}.md` },
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

  let paths = pageListData.getPageList.edges.map((page) => ({
    params: { filename: page.node.sys.filename },
  }))
  paths = paths.filter((path) => path.params.filename != 'items')
  return {
    paths,
    fallback: 'blocking',
  };
};