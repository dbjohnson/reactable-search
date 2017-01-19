var context = require.context('./test', true, /-test\.jsx?$/);
context.keys().forEach(context);
