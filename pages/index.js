import { Box, Button, Text, TextField, Image } from '@skynexui/components'
import appConfig from '../config.json'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

//Criei uma tag title e desenvolvi oque eu quero dela
function Titulo(props) {
  const Tag = props.tag || h1
  return (
    <>
      <Tag>{props.children}</Tag>
      <style jsx>{`
        ${Tag} {
          color: ${appConfig.theme.colors.neutrals['700']};
          font-size: 24px;
          font-weight: 600;
        }
      `}</style>
    </>
  )
}

export default function PaginaInicial() {
  const [username, setUsername] = React.useState('txfthiago')
  const roteamento = useRouter()

  const [githubAccount, setGithubAccount] = React.useState('')

  useEffect(() => {
    fetch(`https://api.github.com/users/${username}`)
      .then(res => {
        if (!res.ok) {
          throw Error('Não conseguiu fazer a requisição')
        }
        return res.json()
      })
      .then(resultado => {
        setGithubAccount(resultado)
      })
      .catch(err => {
        console.log(err.message)
      })
  }, [username])

  return (
    <>
      <Box
        styleSheet={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: appConfig.theme.colors.primary[100],
          backgroundImage:
            'url(https://images.pexels.com/photos/7096/people-woman-coffee-meeting.jpg?cs=srgb&dl=pexels-startup-stock-photos-7096.jpg&fm=jpg)',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundBlendMode: 'multiply'
        }}
      >
        <Box
          styleSheet={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: {
              xs: 'column',
              sm: 'row'
            },
            width: '100%',
            maxWidth: '700px',
            borderRadius: '5px',
            padding: '32px',
            margin: '16px',
            boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
            backgroundColor: appConfig.theme.colors.neutrals[500]
          }}
        >
          {/* Formulário */}
          <Box
            as="form"
            onSubmit={function (infosDoEvento) {
              infosDoEvento.preventDefault()
              roteamento.push(`/chat?username=${username} `)
            }}
            styleSheet={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: { xs: '100%', sm: '50%' },
              textAlign: 'center',
              marginBottom: '32px'
            }}
          >
            <Titulo tag="h2">Boas vindas de volta!</Titulo>
            <Text
              variant="body3"
              styleSheet={{
                marginBottom: '32px',
                color: appConfig.theme.colors.neutrals[501]
              }}
            >
              {appConfig.name}
            </Text>
            <TextField
              value={username}
              onChange={function (event) {
                console.log('usuario digitou', event.target.value)
                // Onde ta o valor?
                const valor = event.target.value
                // Trocar o valor da variavel
                // através do React e avise quem precisa
                setUsername(valor)
              }}
              fullWidth
              textFieldColors={{
                neutral: {
                  textColor: appConfig.theme.colors.neutrals[200],
                  mainColor: appConfig.theme.colors.neutrals[900],
                  mainColorHighlight: appConfig.theme.colors.primary[500],
                  backgroundColor: appConfig.theme.colors.neutrals[800]
                }
              }}
            />
            <Button
              type="submit"
              label="Entrar"
              fullWidth
              buttonColors={{
                contrastColor: appConfig.theme.colors.neutrals['000'],
                mainColor: appConfig.theme.colors.primary[600],
                mainColorLight: appConfig.theme.colors.primary[400],
                mainColorStrong: appConfig.theme.colors.primary[600]
              }}
            />
          </Box>
          {/* Formulário */}

          {/* Photo Area */}
          {username.length > 2 && (
            <Box
              styleSheet={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                maxWidth: '200px',
                padding: '16px',
                backgroundColor: appConfig.theme.colors[700],
                border: '1px solid',
                borderColor: appConfig.theme.colors.neutrals[999],
                borderRadius: '10px',
                flex: 1,
                minHeight: '240px'
              }}
            >
              <Image
                styleSheet={{
                  borderRadius: '50%',
                  marginBottom: '16px'
                }}
                src={`https://github.com/${username}.png`}
              />
              <Box
                styleSheet={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                <Text
                  variant="body4"
                  styleSheet={{
                    color: appConfig.theme.colors.neutrals[200],
                    backgroundColor: appConfig.theme.colors.neutrals[900],
                    padding: '3px 10px',
                    borderRadius: '1000px'
                  }}
                >
                  {username}
                </Text>
                <ul
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}
                >
                  <li>
                    <Text
                      variant="body4"
                      styleSheet={{
                        color: appConfig.theme.colors.neutrals[900]
                      }}
                    >
                      {' '}
                      {githubAccount.name}{' '}
                    </Text>
                  </li>
                  <li>
                    <Text
                      variant="body4"
                      styleSheet={{
                        color: appConfig.theme.colors.neutrals[900]
                      }}
                    >
                      {' '}
                      {githubAccount.location}{' '}
                    </Text>
                  </li>
                  <li>
                    <a
                      variant="body4"
                      style={{
                        border: 'solid 1px black',
                        padding: '0px 5px',
                        borderRadius: '10px',
                        textDecoration: 'none',
                        color: appConfig.theme.colors.neutrals[900],
                        fontSize: '10px',
                        cursor: 'pointer'
                      }}
                      href={githubAccount.html_url}
                    >
                      {' '}
                      Go to Git
                    </a>
                  </li>
                </ul>
              </Box>
            </Box>
          )}
          {/* Photo Area */}
        </Box>
      </Box>
    </>
  )
}
