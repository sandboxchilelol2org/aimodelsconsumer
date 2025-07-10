# OpenAI Chat Application

Una aplicación React para interactuar con modelos de OpenAI en modalidad de chat.

## Configuración

1. Instala las dependencias:
```bash
npm install
```

2. Configura las variables de entorno en el archivo `.env`:
```
REACT_APP_OPENAI_API_KEY=tu_api_key_de_openai
REACT_APP_OPENAI_ENDPOINT=https://api.openai.com/v1/chat/completions
```

3. Ejecuta la aplicación:
```bash
npm start
```

## Características

- Chat interactivo con OpenAI GPT
- Interfaz moderna y responsiva
- Autenticación por variables de entorno
- Historial de conversación
- Indicador de escritura

## Uso

1. Ingresa tu mensaje en el campo de texto
2. Presiona Enter o haz clic en "Enviar"
3. La aplicación enviará tu mensaje a OpenAI y mostrará la respuesta
