import { getStaticPropsForTina } from "tinacms";
import Markdown from "react-markdown";
import styled from "styled-components"
import { useRouter } from "next/router";
import { useState, useEffect } from "react";


export const tags = [
  {
    name: "coin",
    label: "Coins"
  },
  {
    name: "bullet",
    label: "Bullets"
  },
  {
    name: "misc",
    label: "Misc"
  },
]

export default function Items(props) {
  const data = props.data.getPageDocument.data

  const tagsToUse = [
    {
      name: "all",
      label: "All"
    },
    ...tags
  ]

  const [selectedTag, setSelectedTag] = useState(tagsToUse[0])
  const [items, setItems] = useState(props.data.getItemList.edges)
  
  useEffect(() => {
    const startingItems = props.data.getItemList.edges
    if (selectedTag.name == "all") {
      setItems(startingItems)
    } else {
      setItems(startingItems.filter((item) => item.node.data.tags.includes(selectedTag.name)))
    }
  }, [selectedTag])

  const router = useRouter()
  
  return (
    <>
      <PageInfo>
        <h1>{data.title}</h1>
        <Markdown>{data.body}</Markdown>
      </PageInfo>
      <Tags>
        {tagsToUse.map(tag => {
          return (
          <Tag onClick={() => setSelectedTag(tag)} selected={tag.name == selectedTag.name}>{tag.label}</Tag>
          )
        })}
      </Tags>
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

const Tags = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 1em;
`
interface TagProps {
  selected: boolean
}

const Tag = styled.div<TagProps>`
  margin: 0 1em 0 1em;
  font-size: 1.5em;

  transition-duration: .25s;
  padding: .5em .5em .5em .5em;
  border-radius: 20%;

  &:hover{
    cursor: pointer;
  }

  ${props => props.selected ? `
    box-shadow: 0px 0px 10px #888888;
  ` : ``}
`

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
                  tags
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