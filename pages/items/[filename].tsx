import { ExperimentalGetTinaClient } from "../../.tina/__generated__/types";
import { TinaMarkdown } from 'tinacms/dist/rich-text'
import { useRouter } from "next/router";
import styled from "styled-components"
import Viewer from 'viewerjs'
import 'viewerjs/dist/viewer.css'
import { useEffect } from "react";
import { useTina } from "tinacms/dist/edit-state";

export default function Item(props: AsyncReturnType<typeof getStaticProps>["props"]) {
  const data = useTina(props.item).data.getItemDocument.data
  const router = useRouter()

  useEffect(() => {
    new Viewer(document.getElementById("page"))
  }, [])
  
  return <> 
  <BackButton onClick={() => router.back()}>Back</BackButton>
  <Page id="page">  
    <h1>
      {data.name}
    </h1>
    <h2>From {data.made}</h2>
    <h3>Found in {data.found?.where}, {data.found?.when}</h3>
    <TinaMarkdown content={data.description} />
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
  cursor: pointer;
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
  const client = ExperimentalGetTinaClient()
  const item = await client.getItemDocument({
    relativePath: `${params.filename}.md`
  })

  return {
    props: {
      item
    }
  }
}

export const getStaticPaths = async () => {
  const client = ExperimentalGetTinaClient()
  const items = await client.getItemList()
  
  return {
    paths: items.data.getItemList.edges.map((page) => ({
      params: { filename: page.node.sys.filename },
    })),
    fallback: 'blocking',
  };
}

export type AsyncReturnType<T extends (...args: any) => Promise<any>> =
  T extends (...args: any) => Promise<infer R> ? R : any;
