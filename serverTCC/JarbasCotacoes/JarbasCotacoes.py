import requests

class PromastersAPI(object):  
    #TODO: docstring  
    fonte = "http://api.promasters.net.br/cotacao/v1/valores"

    def __init__(self):
        self.cotacao = None
        self.api_status = False
        self.status_code = 404

    def update_cotacao(self):
        #TODO: docstring
        resposta = requests.get(PromastersAPI.fonte)

        if resposta.status_code == 200:
            simbolos = list()
            moedas = list()

            dados_cotacao = resposta.json()

            simbolos = list(dados_cotacao['valores'].keys())

            for simbolo in simbolos:
                dados_moeda = dados_cotacao['valores'][simbolo]
                nova_moeda = Moeda(
                    simbolo,
                    str(dados_moeda['nome']),
                    str(dados_moeda['valor']),
                    str(dados_moeda['ultima_consulta']),
                    str(dados_moeda['fonte'])
                )
                moedas.append(nova_moeda)

            self.cotacao = Cotacao(simbolos, moedas)
            self.status_code = resposta.status_code
            self.api_status = dados_cotacao['status']
        #TODO: checagem de erros e ações para outros códigos HTTP.

class Cotacao(object):
    #TODO: docstring

    def __init__(self, simbolos, moedas):
        self.simbolos = simbolos
        self.moedas = moedas

class Moeda(object):
    #TODO: docstring

    def __init__(self, simbolo, nome, cotacaoComercial, ultimaConsulta, fonte):
        self.simbolo = simbolo
        self.nome = nome
        self.cotacaoComercial = cotacaoComercial
        #self.ultimaConsulta = ultimaConsulta
        self.fonte = fonte

    def __iter__(self):
       return iter([('simbolo', self.simbolo), ('nome', self.nome), ('cotacaoComercial', self.cotacaoComercial), ('fonte', self.fonte)])

def main():
    #TODO: docstring
    #TODO: reescrever o código. Não é necessário fazer serialização, apenas mandar
    #      objetos dict que a biblioteca se encarrega de serializar. Reescrever
    #      a estrutura de cotação, tem muita coisa não sendo usada. MAS FUNCIONA!

    api_cotacoes = PromastersAPI()
    api_cotacoes.update_cotacao()

    for moeda in api_cotacoes.cotacao.moedas:
        request = requests.post('http://localhost:5000/api/Moedas', json=dict(moeda))
        print(request.json)

if __name__ == "__main__":
    main()
