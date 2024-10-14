import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return ( <
        Html lang = "en" >
        <
        Head / >
        <
        body >
        <
        Main / >
        <
        NextScript / >
        <
        script defer src = 'https://static.cloudflareinsights.com/beacon.min.js'
        data - cf - beacon = '{"token": "62b380f5f7894f1cba1ce496815139a6"}' /
        >
        <
        /body> <
        /Html>
    )
}