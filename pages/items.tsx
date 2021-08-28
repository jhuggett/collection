import { getStaticPropsForTina } from "tinacms";
import Markdown from "react-markdown";
import styled from "styled-components"
import { useRouter } from "next/router";

export default function Items(props) {
  const data = props.data.getPageDocument.data
  const items = props.data.getItemList.edges
  
  const router = useRouter()
  
  return (
    <>
      <PageInfo>
        <h1>{data.title}</h1>
        <Markdown>{data.body}</Markdown>
      </PageInfo>
      <Container>
        {items.map((edge) => {
          return <Item onClick={() => router.push(`items/${edge.node.sys.filename}`)}>
            <Title>
              <div>{edge.node.data.name}</div>
              <div>({edge.node.data.made})</div>
              </Title>
            
              <img width={300} src={edge.node.data.images[0].myImage} />
              
          </Item>
        })}
      </Container>
    </>
  )
}

const PageInfo = styled.div`
  text-align: center
`


const Title = styled.div`
  width: 100%;
  
  font-size: 1.25em;

  text-align: center;

  padding-top: 2em;

`

const Item = styled.div`
  border-width: 1em;
  border-radius: 15%;
  
  margin: 1em 1em 1em 1em;

  box-shadow: 0px 0px 0px #888888;
  transition-duration: .25s;
  &:hover {
    box-shadow: 0px 0px 42px #888888;
    
    cursor: pointer;
  }
`
const Container = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  justify-content: space-evenly;
`

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
                  made
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