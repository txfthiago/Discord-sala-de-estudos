import { Box, Text, TextField, Image, Button } from '@skynexui/components'
import React, { useState } from 'react'
import appConfig from '../config.json'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationArrow } from '@fortawesome/free-solid-svg-icons'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/router'
import { ButtonSendSticker } from '../src/componentes/ButtonSendSticker'

const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzM0NjAwOSwiZXhwIjoxOTU4OTIyMDA5fQ.nOvgmS6laCUTS6xOsar5TurkpMeczM9mNpWa_y9aW1E'
const SUPABASE_URL = 'https://qopxmvstwdzqopmvktrt.supabase.co'
const supaBaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

function escutaMensagensEmTempoReal(adiconaMensagem) {
  return supaBaseClient
    .from('mensagens')
    .on('INSERT', respostaLive => {
      adiconaMensagem(respostaLive.new)
    })
    .subscribe()
}

export default function ChatPage() {
  const roteamento = useRouter()
  const usuarioLogado = roteamento.query.username
  const [mensagem, setMensagem] = React.useState('')
  const [listaDeMensagens, setListaDeMensagens] = React.useState([])
  React.useEffect(() => {
    supaBaseClient
      .from('mensagens')
      .select('*')
      .order('id', { ascending: false })
      .then(({ data }) => {
        console.log('Dados consultados', data)
        setListaDeMensagens(data)
      })
    escutaMensagensEmTempoReal(novaMensagem => {
      setListaDeMensagens(valorAtualDaLista => {
        return [novaMensagem, ...valorAtualDaLista]
      })
    })
  }, [])

  function handleNovaMensagem(novaMensagem) {
    const mensagem = {
      //id: listaDeMensagens.length + 1,
      de: usuarioLogado,
      texto: novaMensagem
    }

    supaBaseClient
      .from(`mensagens`)
      .insert([mensagem])
      .then(({ data }) => {
        console.log('criando mensagem', data[0])
        //
      })

    //
    setMensagem('')
  }
  return (
    <Box
      styleSheet={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: appConfig.theme.colors.primary[100],
        backgroundImage: `url(https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940)`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundBlendMode: 'multiply',
        color: appConfig.theme.colors.neutrals['000']
      }}
    >
      <Box
        styleSheet={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
          borderRadius: '5px',
          backgroundColor: appConfig.theme.colors.neutrals[500],
          height: '100%',
          maxWidth: '85%',
          maxHeight: '95vh',
          padding: '25px'
        }}
      >
        <Header />
        <Box
          styleSheet={{
            position: 'relative',
            display: 'flex',
            flex: 1,
            height: '80%',
            backgroundColor: appConfig.theme.colors.neutrals[600],
            flexDirection: 'column',
            borderRadius: '5px',
            padding: '16px'
          }}
        >
          <MessageList mensagens={listaDeMensagens} />
          {/* <MessageList mensagens={[]} /> */}

          <Box
            as="form"
            styleSheet={{
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <TextField
              value={mensagem}
              onChange={function (event) {
                const valor = event.target.value
                setMensagem(valor)
              }}
              onKeyPress={function (event) {
                if (event.key === 'Enter') {
                  event.preventDefault()

                  handleNovaMensagem(mensagem)
                }
              }}
              placeholder="Insira sua mensagem aqui..."
              type="textarea"
              styleSheet={{
                width: '100%',
                border: '0',
                resize: 'none',
                borderRadius: '5px',
                padding: '3px 8px',
                backgroundColor: appConfig.theme.colors.neutrals[800],
                marginRight: '12px',
                color: appConfig.theme.colors.neutrals[200]
              }}
            />

            <FontAwesomeIcon
              onClick={e => {
                if (mensagem.length > 0) {
                  e.preventDefault()
                  handleNovaMensagem(mensagem)
                }
              }}
              style={{
                marginLeft: '10px',
                cursor: 'pointer',
                color: 'white',
                fontSize: '20px',
                color: appConfig.theme.colors.primary[600]
              }}
              icon={faLocationArrow}
            />
            <ButtonSendSticker
              onStickerClick={sticker => {
                handleNovaMensagem(':sticker: ' + sticker)
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

function Header() {
  return (
    <>
      <Box
        styleSheet={{
          width: '100%',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Text variant="heading5">Chat</Text>
        <Button
          variant="tertiary"
          colorVariant="neutral"
          label="Logout"
          href="/"
        />
      </Box>
    </>
  )
}

function MessageList(props) {
  console.log(props.listaDeMensagens)
  return (
    <Box
      tag="ul"
      styleSheet={{
        overflow: 'scroll',
        display: 'flex',
        flexDirection: 'column-reverse',
        flex: 1,
        color: appConfig.theme.colors.neutrals['000'],
        marginBottom: '16px'
      }}
    >
      {props.mensagens.map(mensagem => {
        return (
          <Text
            key={mensagem.id}
            tag="li"
            styleSheet={{
              borderRadius: '5px',
              padding: '6px',
              marginBottom: '12px',
              hover: {
                backgroundColor: appConfig.theme.colors.neutrals[700]
              }
            }}
          >
            <Box
              styleSheet={{
                marginBottom: '8px'
              }}
            >
              <Image
                styleSheet={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  display: 'inline-block',
                  marginRight: '8px'
                }}
                src={`https://github.com/${mensagem.de}.png`}
              />
              <Text tag="strong">{mensagem.de}</Text>
              <Text
                styleSheet={{
                  fontSize: '10px',
                  marginLeft: '8px',
                  color: appConfig.theme.colors.neutrals[300]
                }}
                tag="span"
              >
                {new Date().toLocaleDateString()}
              </Text>
            </Box>
            {/*condicional: {mensagem.texto.startsWith(':sticker:').toString()*/}

            {mensagem.texto.startsWith(':sticker:') ? (
              <Image src={mensagem.texto.replace(':sticker:', '')} />
            ) : (
              mensagem.texto
            )}
            {/*mensagem.texto*/}
          </Text>
        )
      })}
    </Box>
  )
}
