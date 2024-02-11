import 'package:flutter/material.dart';
// import 'package:flutter/services.dart';

class Home extends StatefulWidget {
  const Home({super.key});

  @override
  State<Home> createState() => _HomeState();
}

class _HomeState extends State<Home> {
  // * This is to remove the status bar
  // @override
  // void initState() {
  //   super.initState();
  //   SystemChrome.setEnabledSystemUIMode(SystemUiMode.leanBack);
  // }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: Scaffold(
        appBar: AppBar(
          title: const Text('Lottery Genie'),
          backgroundColor: Colors.blue[900],
          // systemOverlayStyle:
          //     const SystemUiOverlayStyle(statusBarColor: Colors.transparent),
        ),
        body: const Center(
          child: Text('The start of something amazing!'),
        ),
      ),
    );
  }
}
