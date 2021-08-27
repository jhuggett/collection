import { getStaticPropsForTina } from "tinacms";
import Markdown from "react-markdown";

export default function Items(props) {
  const data = props.data.getPageDocument.data
  const items = props.data.getItemList.edges
  
  return (
    <>
      <h1>{data.title}</h1>
      <Markdown>{data.body}</Markdown>
      {items.map((edge) => {
        return <div>
          <a href={`items/${edge.node.sys.filename}`}>{edge.node.data.name} ({edge.node.data.year})</a>
          <div>
            <img width={250} src={edge.node.data.images[0].myImage} />
          </div>
        </div>
      })}
    </>
  )
}

export const getStaticProps = async ({ params }) => {
  
  const tinaProps = (await getStaticPropsForTina({
    query: `#graphql
      {
        getPageDocument(relativePath: "items.md") {
          data {
            title
            body
          }
        }
        getItemList {
          edges {
            node {
              sys {
                filename
              }
              data {
                  name
                  year
                  images {
                    myImage
                  }
              }
            }
          }
        }
      }
    `,
  }));
  return {
    props: {
      ...tinaProps,
    },
  };
};