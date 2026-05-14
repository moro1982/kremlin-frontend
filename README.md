### KREMLIN Online - Notas de desarrollo ###

## Introducción ##

Este proyecto en su estado actual forma parte de un proyecto de largo aliento, consistente en el desarrollo de una versión del juego de mesa Kremlin en versión online.

A los fines de cumplir lo requerido para el examen final de Taller de Programación IV, he decidido completar el desarrollo sólo hasta una etapa inicial del juego, para mostrar las tecnologías utilizadas y su funcionamiento en tiempo real.

## Breve reseña del juego ##

Kremlin es un juego de mesa, de 3 a 6 jugadores, que representa una sátira de la política durante la Unión Soviética. El juego tuvo una primera versión en 1986, cuando la URSS existía, reimprimiéndose pocas veces en años posteriores.

En el juego, cada jugador representa una facción dentro del Partido, la cual debe influir sobre los políticos que se ubican al azar en la pirámide del Politburó, con el fin de eventualmente controlar al máximo Líder del partido. El jugador que lo logre en 3 turnos (consecutivos o no), gana el juego. Existen, además, otras condiciones de victoria, que por el momento no se implementarán.

El juego es bastante complejo, ya que posee muchas reglas que deben cumplirse a lo largo de 10 turnos, cada uno de ellos con 8 Fases, en las que se pueden realizar diferentes acciones. Uno a uno, los políticos que ocupan los diferentes cargos en el Politburó podrán realizar las acciones que dicho cargo les habilita.

Para controlar a los diferentes políticos, al inicio del juego (y antes de repartir los políticos en el Politburó) los jugadores ASIGNAN secretamente un valor de influencia sobre 10 políticos de su elección de entre un total de 26. Los valores a asignar van del 1 al 10, y no pueden repetirse. De esta forma, cada jugador tendrá un político con influencia asignada 1, otro con 2, etc.

Cuando todos terminan de asignar su influencia en 10 políticos, comienza el juego, iniciándose el turno 1, fase 1. A partir de este momento, los jugadores pueden DECLARAR el valor de influencia asignada sobre un político, a fin de controlarlo. Si otro jugador también tiene influencia asignada sobre el mismo político, puede a su vez declarar un valor de influencia mayor, y el control pasa a ser suyo.

Cabe aclarar que no se puede declarar más influencia de la que se ha asignado, pero sí puede declararse un valor menor, para luego incrementarlo oportunamente. Esto se utiliza tácticamente, para no perder toda la influencia por acciones posteriores que puedan eliminarla.

Hasta aquí, la explicación de las reglas necesarias para comprender lo desarrollado hasta el momento.

## Descripción del desarrollo del frontend ##

El frontend está estructurado en torno a la construcción y actualización constante del estado del juego, a partir de su consulta via HTTP al backend. Éste retorna un DTO con el estado del juego (Game), el cual será utilizado para construir el estado en el frontend (GameState).

Para la circulación de los datos del estado GameState a lo ancho y largo del sitio, utilizamos un servicio centralizado (GameStore) para realizar las acciones requeridas por los diferentes componentes. Es como el orquestador que intermedia entre el estado del juego y los componentes del frontend. En el desarrollo de este servicio, y alo largo de los componentes, se utilizaron Signals, a fin de llevar un control más simplificado del estado y de los cambios realizados en el mismo.

