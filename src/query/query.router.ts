import gamedig, {Type} from 'gamedig';
import express, { Request, Response } from 'express';
import { off } from 'process';

export const queryRouter = express.Router();

queryRouter.get('/:type/:host/:port', async (req: Request, res: Response) => {
    try {
        const type: Type = req.params.type as Type;
        const host: string = req.params.host;
        const port: number = parseInt(req.params.port);
        const outputTemplate: string = decodeURI(req.query.template as string);
        let offlineMessage: string = decodeURI(req.query.offline_message as string);
        if(!offlineMessage) {
            offlineMessage = 'Server offline';
        }

        gamedig.query({
            type: type,
            host: host,
            port: port,
            givenPortOnly: true
        }).then(r => {
            const players_amount = r.players.length||'-',
                players_max = r.maxplayers,
                server_ping = r.ping,
                server_connect = r.connect;

	    if (req.query.template) {
	      const renderLine = outputTemplate
                    .replace(/{type}/g, type.toString())
                    .replace(/{host}/g, host)
                    .replace(/{port}/g, port.toString())
                    .replace(/{players_amount}/g, players_amount.toString())
                    .replace(/{players_max}/g, players_max.toString())
                    .replace(/{server_ping}/g, server_ping.toString())
                    .replace(/{server_connect}/g, server_connect);
	      res.status(200).send(renderLine);
	    } else {
	      res.status(200).json(r);
	    }
        }).catch(e => {
            res.status(200).send(offlineMessage);
        });
    } catch (e) {
        res.status(404).send(e.message);
    }
});
