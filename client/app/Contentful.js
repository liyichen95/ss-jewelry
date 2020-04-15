import {createClient} from 'contentful';
import config from '../../config/config';

export default createClient({
    space: config.API_SPACE,
    accessToken: config.API_TOKEN
});