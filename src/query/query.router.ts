import gamedig, {Type} from 'gamedig';
import express, { Request, Response } from 'express';
import { off } from 'process';

export const queryRouter = express.Router();
const fs = require('fs');
const NodeCache = require( 'node-cache' );
const queryCache = new NodeCache({ stdTTL: 30, checkperiod: 120 });

const parseTemplate = (request: Request, response: gamedig.QueryResult) => {
    const type: Type = request.params.type as Type;
    const host: string = request.params.host;
    const port: number = parseInt(request.params.port);
    const template: string = decodeURI(request.query.template as string);

    const players_amount = response.players.length||'-',
        players_max = response.maxplayers,
        server_ping = response.ping,
        server_connect = response.connect;

    const parsed = template
        .replace(/{type}/g, type.toString())
        .replace(/{host}/g, host)
        .replace(/{port}/g, port.toString())
        .replace(/{players_amount}/g, players_amount.toString())
        .replace(/{players_max}/g, players_max.toString())
        .replace(/{server_ping}/g, server_ping.toString())
        .replace(/{server_connect}/g, server_connect);
    return parsed; 
};

queryRouter.get('/:type/:host/:port', async (req: Request, res: Response) => {
    try {
        const type: Type = req.params.type as Type;
        const host: string = req.params.host;
        const port: number = parseInt(req.params.port);
        const cacheKey: string = type + host + port;
        
        let offlineMessage: string = decodeURI(req.query.offline_message as string);
        if(!req.query.offline_message) {
            offlineMessage = 'Server offline';
        }

        if (queryCache.has(cacheKey)) {
            const gamedigReponse = queryCache.get(cacheKey);
            if(req.query.template) {
                res.status(200).send(parseTemplate(req, gamedigReponse));
            } else {
                res.status(200).json(gamedigReponse);
            }
        } else {
            gamedig.query({
                type: type,
                host: host,
                port: port,
                givenPortOnly: true
            }).then(r => {
                queryCache.set(cacheKey , r);
                if(req.query.template) {
                    res.status(200).send(parseTemplate(req, r));
                } else {
                    res.status(200).json(r);
                }
            }).catch(e => {
                res.status(500).send(offlineMessage);
            });
        }
    } catch (e) {
        res.status(404).send(e.message);
    }
});



queryRouter.get('/types', async (req: Request, res: Response) => {
    fs.readFile('./node_modules/gamedig/games.txt', 'utf8' , (err : any, data : any) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        const lines = data
            .toString()
            .replace(/^\s*[\r\n]/gm, '')
            .split('\n')
            .map((line : any) => {
                const splittedLine = line.toString().split('|');
                return {
                    name: splittedLine[0],
                    pretty_name: splittedLine[1],
                    options: splittedLine[3],
                };
            });
        lines.shift();
        res.status(200).send(lines);
        //console.log(lines);
    });
});