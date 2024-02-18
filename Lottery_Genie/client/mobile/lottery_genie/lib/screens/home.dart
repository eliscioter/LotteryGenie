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
      home: SafeArea(
        child: Scaffold(
          body: SizedBox(
            height: double.infinity,
            width: double.infinity,
            // color: Color(0xFF36453B),
            child: Container(
              color: const Color(0xFF36453B),
              child: Column(
                children: [
                  const Padding(
                    padding: EdgeInsets.only(top: 20, left: 20, right: 20),
                    child: Column(
                      children: [
                        Padding(
                          padding: EdgeInsets.only(top: 20, bottom: 20),
                          child: Text(
                            "February 18, 2024",
                            // textAlign: TextAlign.center,
                            style: TextStyle(
                              color: Color(0xFFC2C1A5),
                              fontSize: 20,
                            ),
                          ),
                        ),
                        SizedBox(
                          height: 20,
                        ),
                        Align(
                          alignment: Alignment.centerLeft,
                          child: Text(
                            "6/49",
                            style: TextStyle(
                              color: Color(0xFFF5F9E9),
                              fontSize: 18,
                            ),
                          ),
                        ),
                        Text(
                          "₱ 15,000,000.00",
                          style: TextStyle(
                            color: Color(0xFFC2C1A5),
                            fontSize: 24,
                          ),
                        ),
                        SizedBox(
                          height: 20,
                        ),
                        Align(
                          alignment: Alignment.centerLeft,
                          child: Text(
                            "6/49",
                            style: TextStyle(
                              color: Color(0xFFF5F9E9),
                              fontSize: 18,
                            ),
                          ),
                        ),
                        Text(
                          "₱ 15,000,000.00",
                          style: TextStyle(
                            color: Color(0xFFC2C1A5),
                            fontSize: 24,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(
                    height: 20,
                  ),
                  Expanded(
                    child: Container(
                      width: double.infinity,
                      margin: const EdgeInsets.only(top: 30),
                      padding: const EdgeInsets.all(30),
                      decoration: const BoxDecoration(
                        color: Color(0xFF596869),
                        borderRadius: BorderRadius.only(
                          topLeft: Radius.circular(40),
                          topRight: Radius.circular(40),
                        ),
                      ),
                      child: Column(
                        children: [
                          Row(
                            children: [
                              ElevatedButton(
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: const Color(0xFF515751),
                                  foregroundColor: const Color(0xFFC2C1A5),
                                ),
                                onPressed: () {},
                                child: const Text("6/55"),
                              ),
                              const SizedBox(
                                width: 20,
                              ),
                              ElevatedButton(
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: const Color(0xFF515751),
                                  foregroundColor: const Color(0xFFC2C1A5),
                                ),
                                onPressed: () {},
                                child: const Text("Select Date"),
                              ),
                            ],
                          ),
                          Padding(
                            padding: const EdgeInsets.all(15.0),
                            child: Row(
                              children: [
                                Expanded(
                                  child: TextFormField(
                                    cursorColor: const Color(0xFFF5F9E9),
                                    textAlign: TextAlign.center,
                                    decoration: const InputDecoration(
                                      labelText: "Enter your numbers",
                                      labelStyle: TextStyle(
                                        color: Color(0xFFF5F9E9),
                                      ),
                                      border: OutlineInputBorder(),
                                      focusedBorder: OutlineInputBorder(
                                        borderRadius: BorderRadius.only(
                                          topLeft: Radius.circular(15),
                                          bottomLeft: Radius.circular(15),
                                        ),
                                        borderSide: BorderSide(
                                          color: Color(0xFF36453B),
                                        ),
                                      ),
                                      enabledBorder: OutlineInputBorder(
                                        borderRadius: BorderRadius.only(
                                          topLeft: Radius.circular(15),
                                          bottomLeft: Radius.circular(15),
                                        ),
                                        borderSide: BorderSide(
                                          color: Color(0xFFF5F9E9),
                                        ),
                                      ),
                                    ),
                                  ),
                                ),
                                ElevatedButton(
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: const Color(0xFF515751),
                                    foregroundColor: const Color(0xFFC2C1A5),
                                    minimumSize: const Size(100, 64),
                                    shape: const RoundedRectangleBorder(
                                      borderRadius: BorderRadius.only(
                                        topRight: Radius.circular(15),
                                        bottomRight: Radius.circular(15),
                                      ),
                                    ),
                                  ),
                                  onPressed: () {},
                                  child: const Text("Check"),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(
                            height: 20,
                          ),
                          const Align(
                            alignment: Alignment.centerLeft,
                            child: Text(
                              "You got 5 out of 6. Congratulations, you won!",
                            ),
                          ),
                          const SizedBox(
                            height: 20,
                          ),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceAround,
                            children: [
                              Container(
                                decoration: const BoxDecoration(
                                  color: Color(0xFF008000),
                                  shape: BoxShape.circle,
                                ),
                                padding: const EdgeInsets.all(15),
                                child: const Text(
                                  "15",
                                  style: TextStyle(
                                      color: Color(0xFFF5F9E9), fontSize: 16),
                                ),
                              ),
                              Container(
                                decoration: const BoxDecoration(
                                  color: Color(0xFF008000),
                                  shape: BoxShape.circle,
                                ),
                                padding: const EdgeInsets.all(15),
                                child: const Text(
                                  "15",
                                  style: TextStyle(
                                      color: Color(0xFFF5F9E9), fontSize: 16),
                                ),
                              ),
                              Container(
                                decoration: const BoxDecoration(
                                  color: Color(0xFF008000),
                                  shape: BoxShape.circle,
                                ),
                                padding: const EdgeInsets.all(15),
                                child: const Text(
                                  "15",
                                  style: TextStyle(
                                      color: Color(0xFFF5F9E9), fontSize: 16),
                                ),
                              ),
                              Container(
                                decoration: const BoxDecoration(
                                  color: Color(0xFF008000),
                                  shape: BoxShape.circle,
                                ),
                                padding: const EdgeInsets.all(15),
                                child: const Text(
                                  "15",
                                  style: TextStyle(
                                      color: Color(0xFFF5F9E9), fontSize: 16),
                                ),
                              ),
                              Container(
                                decoration: const BoxDecoration(
                                  color: Color(0xFF880808),
                                  shape: BoxShape.circle,
                                ),
                                padding: const EdgeInsets.all(15),
                                child: const Text(
                                  "15",
                                  style: TextStyle(
                                      color: Color(0xFFF5F9E9), fontSize: 16),
                                ),
                              ),
                              Container(
                                decoration: const BoxDecoration(
                                  color: Color(0xFF008000),
                                  shape: BoxShape.circle,
                                ),
                                padding: const EdgeInsets.all(15),
                                child: const Text(
                                  "15",
                                  style: TextStyle(
                                      color: Color(0xFFF5F9E9), fontSize: 16),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(
                            height: 30,
                          ),
                          const Text(
                            "You won ₱ 1,000,000.00!",
                            style: TextStyle(
                              fontSize: 24,
                              color: Color(0xFFF5F9E9),
                            ),
                          ),
                        ],
                      ),
                    ),
                  )
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
