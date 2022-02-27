import styled from "styled-components"
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { ExperimentalGetTinaClient } from "../.tina/__generated__/types";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { useTina } from "tinacms/dist/edit-state";

const tags = [
  {
    "name": "coin",
    "label": "Coins"
  },
  {
    "name": "bullet",
    "label": "Bullets"
  },
  {
    "name": "misc",
    "label": "Misc"
  }
]

export default function Items(props: AsyncReturnType<typeof getStaticProps>["props"]) {
  const page = useTina(props.page).data.getPageDocument.data

  //@ts-ignore
  const theme = props.themeConfig

  const tagsToUse = [
    {
      name: "all",
      label: "All"
    },
    ...tags
  ]

  const [selectedTag, setSelectedTag] = useState(tagsToUse[0])
  const [items, setItems] = useState([])
  
  useEffect(() => {
    const startingItems = props.items.data.getItemList.edges.map(item => item.node)
    if (selectedTag.name == "all") {
      setItems(startingItems)
    } else {
      setItems(startingItems.filter((item) => item.data.tags.includes(selectedTag.name)))
    }
  }, [selectedTag])

  const router = useRouter()
  
  return (
    <>
      <PageInfo>
        <Title>{page.title}</Title>
        <TinaMarkdown content={page.body} />
        <ThemeToggler onClick={() => theme.toggleTheme()}>
        {
          theme.getTheme().name == 'light' ?
          "Turn off the lights"
          :
          "Let there be light"
        }
      </ThemeToggler>
      </PageInfo>
      
      <Tags>
        {tagsToUse.map(tag => {
          return (
          <Tag onClick={() => setSelectedTag(tag)} selected={tag.name == selectedTag.name}>{tag.label}</Tag>
          )
        })}
      </Tags>
      <Container>
        {items.map((item) => {
          return <Item onClick={() => router.push(`items/${item.sys.filename}`)}>
            <ItemTitle>
              <ItemName>{item.data.name}</ItemName>
              <div>({item.data.made})</div>
            </ItemTitle>
              <img width={300} src={item.data.images[0].myImage} />
          </Item>
        })}
      </Container>
    </>
  )
}

const ThemeToggler = styled.div`
  text-align: center;
  margin-top: 2em;
  margin-bottom: 2em;
  width: fit-content;
  padding: .5em .5em .5em .5em;
  border-radius: 10px;
  :hover{
    cursor: pointer;
    box-shadow: 0px 0px 10px #888888;
  }
`

const Title = styled.div`
  letter-spacing: .15em;
  font-size: 2.5em;
  font-weight: bold;
  margin-top: 1em;
`

const Tags = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
`
interface TagProps {
  selected: boolean
}

const Tag = styled.div<TagProps>`
  margin: 0 1em 0 1em;
  font-size: 1.5em;
  transition-duration: .25s;
  padding: .5em .5em .5em .5em;
  border-radius: 10px;
  &:hover{
    cursor: pointer;
  }

  ${props => props.selected ? `
    box-shadow: 0px 0px 10px #888888;
  ` : ``}
`

const PageInfo = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;
  text-align: center;
`

const ItemTitle = styled.div`
  width: 100%;
  font-size: 1.25em;
  text-align: center;
  padding-top: 2em;

`

const ItemName = styled.div`
  margin-right: 1em;
  margin-left: 1em;
`
const Item = styled.div`
  border-width: 1em;
  border-radius: 15%;
  margin: 1em 1em 1em 1em;
  box-shadow: 0px 0px 0px #888888;
  transition-duration: .25s;
  display: flex;
  flex-flow: column;
  align-items: center;
  padding-bottom: 1em;
  width: 325px;
  
  
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

export const getStaticProps = async () => {
  const client = ExperimentalGetTinaClient()
  const items = await client.getItemList()
  const page = await client.getPageDocument({relativePath: 'items.md'})

  return {
    props: {
      items,
      page
    }
  }
};

export type AsyncReturnType<T extends (...args: any) => Promise<any>> =
  T extends (...args: any) => Promise<infer R> ? R : any;
