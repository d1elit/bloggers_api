import {errorsHandler} from "../../../core/errors/errors.handler";
import {registrationService} from "../../application/registration.service";
import {Request, Response} from "express";
import {HttpStatus} from "../../../core/types/http-statuses";

export async function registrationHandler(
    req: Request,
    res: Response,
) {
    try {
        let result = await registrationService.register(req.body);
        res.status(HttpStatus.NoContent).send(result);
    } catch(e:unknown) {
        errorsHandler(e,res)
    }

}