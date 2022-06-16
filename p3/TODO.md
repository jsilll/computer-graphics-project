## Tarefa 1
- [ ] Esboçar a cena ilustrada, composta pelas três etapas principais
    1. Apresentar um figura geral de toda a cena
    1. Pequenas Figuras onde são definidas as dimensões que se querem atribuir
    1. Deve ficar claro no esboço quais as malhas de triangulos que estão a considerar como coordenadas de vértices. 

## Tarefa 2
- [ ] Chão Plano (instanciacao de primitivas)
- [ ] Palanque Retilíneo Com 2 Degraus (instanciacao de primitivas) 
- [ ] Três Etapas do Origami colocadas em linha (malhas de poligonos)
- [ ] Três Etapas do Origami colocadas a flutuar 
- [ ] Rotação Vertical de Cada um dos Orgigamis com as teclas 'Q' 'W' 'E' 'R' 'T' 'Y'
- [ ] Calculo da rotação deve ter em conta que o utilizador pode carregar em várias teclas em simultâneo.

## Tarefa 3
- [ ] Alternar entre tipo de material com a tecla 'A'
- [ ] Ativar e desativar o calculo da luz com a tecla 'S'

## Tarefa 4
- [ ] Criar um fonte de luz direcional (angulo à normal do chao != 0)
- [ ] Tecla 'D' desliga e liga a luz direcional
- [ ] Criar 3 holofotes
- [ ] Ativar e Desativar os holofotes com as teclas 'Z' 'X' e 'C'
- [ ] Modelar os holofotes geometricamente com duas primitivas, um cone e uma esfera

## Tarefa 5
- [ ] Usar uma imagem de papel origami como textura

## Tarefa 6
- [ ] Definir uma câmera fixa com vista sobre toda a cena com proj. perspectiva
- [ ] Definir uma câmera fixa que está alinhada e centrada com o referencial do palanque e apontada por forma a visualizarem-se as três peças origami utilizando uma proj. ortogonal
- [ ] Definir uma StereoCamera
- [ ] Mambos homepage pessoal do técnico

## Tarefa 7
- [ ] Pausar a visualização quando o utilizador pressiona a 'space' e retomar ao pressionar o space outra vez. (neste momento isto tem um problema)
- [ ] Mostrar uma mensagem no ecrã que deverá ser sempre legível, independentemente da posição da câmera e das dimensões do viewport (deve-se recorrer a uma segunda projecao ortogonal e um segundo viewport, esta projecao é independente da camera ativa).
- [ ] Fazer o refresh da cena usando a tecla '3' 
- [ ] Eventos de Redimensionamento da janela
- [ ] reiniciar a cena sem ser necessário recarregar a aplicação

## Ajuda no 3o Trabalho

### Tarefa 6
- [ ] Remover: "export" no final do ficheiro VRButton.js e coloca-lo localmente na paste onde se encontra o three.js
- [ ] Usar WebXR API Emulator para visualizar a imagem esteroscópica directamente no browser https://web.tecnico.ulisboa.pt/~ist146643/cg/ (https://chrome.google.com/webstore/detail/webxr-api-emulator/mjddjgeghkdijejnciaefnkjmkafnnje?hl=en)

### Tarefa 7
- enquanto em pausa, o utilizador pode fazer reset, mudar de câmera, ligar e desligar luzes bem como ativar e desativar o calculo da iluminacao, mas nao pode rodar as peças.