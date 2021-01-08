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

            let renderLine = outputTemplate;
            renderLine = renderLine.replace('{type}', type.toString());
            renderLine = renderLine.replace('{host}', host);
            renderLine = renderLine.replace('{port}', port.toString());
            renderLine = renderLine.replace('{players_amount}', players_amount.toString());
            renderLine = renderLine.replace('{players_max}', players_max.toString());
            renderLine = renderLine.replace('{server_ping}', server_ping.toString());
            renderLine = renderLine.replace('{server_connect}', server_connect);
            res.status(200).send(renderLine);
        }).catch(e => {
            res.status(200).send(offlineMessage);
        });
    } catch (e) {
        res.status(404).send(e.message);
    }
});