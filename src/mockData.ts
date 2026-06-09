/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Consumer, Bill, TariffConfig, JavaFile } from './types';

export const initialConsumers: Consumer[] = [
  {
    id: 'CON-1001',
    name: 'Eleanor Vance',
    email: 'eleanor.v@domain.com',
    phone: '+1 (555) 234-5678',
    meterNo: 'MTR-89412',
    address: '742 Evergreen Terrace, Springfield',
    connectionType: 'domestic',
    dateJoined: '2024-01-15',
  },
  {
    id: 'CON-1002',
    name: 'Apex Supermarket',
    email: 'billing@apexcorp.org',
    phone: '+1 (555) 876-5432',
    meterNo: 'MTR-90185',
    address: '102 Main Street, Downtown Plaza',
    connectionType: 'commercial',
    dateJoined: '2023-06-10',
  },
  {
    id: 'CON-1003',
    name: 'Vanguard Steel Works',
    email: 'facilities@vanguardsteel.com',
    phone: '+1 (555) 432-1098',
    meterNo: 'MTR-33928',
    address: 'Industrial Parkway, Shed D',
    connectionType: 'industrial',
    dateJoined: '2022-11-01',
  },
  {
    id: 'CON-1004',
    name: 'Hilltop Farms',
    email: 'office@hilltopfarms.co',
    phone: '+1 (555) 678-9012',
    meterNo: 'MTR-51203',
    address: 'Rural Route 4, Green Valley',
    connectionType: 'agricultural',
    dateJoined: '2025-02-20',
  },
  {
    id: 'CON-1005',
    name: 'Julian Alvarez',
    email: 'julian.al@webmail.io',
    phone: '+1 (555) 901-2345',
    meterNo: 'MTR-76124',
    address: '321 Elm Dr, Maplewood',
    connectionType: 'domestic',
    dateJoined: '2024-09-05',
  },
];

export const initialTariffs: TariffConfig[] = [
  {
    connectionType: 'domestic',
    baseCharge: 12.50,
    taxPercentage: 8.0,
    slabs: [
      { minUnits: 0, maxUnits: 100, rate: 0.15 },
      { minUnits: 101, maxUnits: 300, rate: 0.22 },
      { minUnits: 301, maxUnits: Infinity, rate: 0.30 },
    ],
  },
  {
    connectionType: 'commercial',
    baseCharge: 45.00,
    taxPercentage: 12.0,
    slabs: [
      { minUnits: 0, maxUnits: 200, rate: 0.24 },
      { minUnits: 201, maxUnits: 500, rate: 0.32 },
      { minUnits: 501, maxUnits: Infinity, rate: 0.45 },
    ],
  },
  {
    connectionType: 'industrial',
    baseCharge: 150.00,
    taxPercentage: 15.0,
    slabs: [
      { minUnits: 0, maxUnits: 1000, rate: 0.35 },
      { minUnits: 1001, maxUnits: Infinity, rate: 0.50 },
    ],
  },
  {
    connectionType: 'agricultural',
    baseCharge: 5.00,
    taxPercentage: 5.0,
    slabs: [
      { minUnits: 0, maxUnits: Infinity, rate: 0.08 },
    ],
  },
];

export const initialBills: Bill[] = [
  {
    id: 'BIL-5001',
    consumerId: 'CON-1001',
    consumerName: 'Eleanor Vance',
    connectionType: 'domestic',
    billingMonth: 'May 2026',
    prevReading: 4210,
    currReading: 4425,
    unitsConsumed: 215,
    slabAmount: 40.30, // 100*0.15 + 115*0.22
    fixedCharges: 12.50,
    taxAmount: 4.22, // 8% of (40.30 + 12.50)
    totalAmount: 57.02,
    dueDate: '2026-06-15',
    status: 'paid',
    paymentDate: '2026-06-02',
  },
  {
    id: 'BIL-5002',
    consumerId: 'CON-1002',
    consumerName: 'Apex Supermarket',
    connectionType: 'commercial',
    billingMonth: 'May 2026',
    prevReading: 12450,
    currReading: 13120,
    unitsConsumed: 670,
    slabAmount: 220.50, // 200*0.24 + 300*0.32 + 170*0.45 = 48 + 96 + 76.5
    fixedCharges: 45.00,
    taxAmount: 31.86, // 12% of (220.50 + 45) -> 12% of 265.50
    totalAmount: 297.36,
    dueDate: '2026-06-18',
    status: 'pending',
  },
  {
    id: 'BIL-5003',
    consumerId: 'CON-1003',
    consumerName: 'Vanguard Steel Works',
    connectionType: 'industrial',
    billingMonth: 'May 2026',
    prevReading: 89400,
    currReading: 94850,
    unitsConsumed: 5450,
    slabAmount: 2575.00, // 1000*0.35 + 4450*0.50 = 350 + 2225
    fixedCharges: 150.00,
    taxAmount: 408.75, // 15% of (2575 + 150) -> 15% of 2725
    totalAmount: 3133.75,
    dueDate: '2026-06-12',
    status: 'pending',
  },
  {
    id: 'BIL-5004',
    consumerId: 'CON-1004',
    consumerName: 'Hilltop Farms',
    connectionType: 'agricultural',
    billingMonth: 'May 2026',
    prevReading: 3120,
    currReading: 3950,
    unitsConsumed: 830,
    slabAmount: 66.40, // 830 * 0.08
    fixedCharges: 5.00,
    taxAmount: 3.57, // 5% of (66.4 + 5) -> 5% of 71.4
    totalAmount: 74.97,
    dueDate: '2026-06-20',
    status: 'paid',
    paymentDate: '2026-06-08',
  },
  {
    id: 'BIL-5005',
    consumerId: 'CON-1005',
    consumerName: 'Julian Alvarez',
    connectionType: 'domestic',
    billingMonth: 'May 2026',
    prevReading: 1120,
    currReading: 1210,
    unitsConsumed: 90,
    slabAmount: 13.50, // 90 * 0.15
    fixedCharges: 12.50,
    taxAmount: 2.08, // 8% of (13.5 + 12.5) -> 26 * 0.08 = 2.08
    totalAmount: 28.08,
    dueDate: '2026-06-15',
    status: 'overdue',
  },
  {
    id: 'BIL-5006',
    consumerId: 'CON-1001',
    consumerName: 'Eleanor Vance',
    connectionType: 'domestic',
    billingMonth: 'April 2026',
    prevReading: 3980,
    currReading: 4210,
    unitsConsumed: 230,
    slabAmount: 43.60, // 100*0.15 + 130*0.22 = 15 + 28.6 = 43.6
    fixedCharges: 12.50,
    taxAmount: 4.49,
    totalAmount: 60.59,
    dueDate: '2026-05-15',
    status: 'paid',
    paymentDate: '2026-05-10',
  },
];

export const javaFiles: JavaFile[] = [
  {
    name: 'ConnectionType.java',
    description: 'An enum representing distinct consumer connection tiers, defining specific tax rates and fixed base fees.',
    code: `package com.billing;

public enum ConnectionType {
    DOMESTIC(12.50, 0.08),
    COMMERCIAL(45.00, 0.12),
    INDUSTRIAL(150.00, 0.15),
    AGRICULTURAL(5.00, 0.05);

    private final double baseCharge;
    private final double taxRate;

    ConnectionType(double baseCharge, double taxRate) {
        this.baseCharge = baseCharge;
        this.taxRate = taxRate;
    }

    public double getBaseCharge() {
        return baseCharge;
    }

    public double getTaxRate() {
        return taxRate;
    }
}`
  },
  {
    name: 'Consumer.java',
    description: 'POJO mapping the Consumer entity with relevant attributes like connection category, email, and meter key.',
    code: `package com.billing;

import java.time.LocalDate;

public class Consumer {
    private String id;
    private String name;
    private String email;
    private String phone;
    private String meterNo;
    private String address;
    private ConnectionType connectionType;
    private LocalDate dateJoined;

    public Consumer(String id, String name, String email, String phone, 
                    String meterNo, String address, ConnectionType connectionType) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.meterNo = meterNo;
        this.address = address;
        this.connectionType = connectionType;
        this.dateJoined = LocalDate.now();
    }

    // Getters and Setters
    public String getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
    public String getMeterNo() { return meterNo; }
    public String getAddress() { return address; }
    public ConnectionType getConnectionType() { return connectionType; }
    public LocalDate getDateJoined() { return dateJoined; }
}`
  },
  {
    name: 'TariffSlab.java',
    description: 'Structure describing individual billing slabs for calculating tiered values.',
    code: `package com.billing;

public class TariffSlab {
    private final double minUnits;
    private final double maxUnits;
    private final double rate;

    public TariffSlab(double minUnits, double maxUnits, double rate) {
        this.minUnits = minUnits;
        this.maxUnits = maxUnits;
        this.rate = rate;
    }

    public double getMinUnits() { return minUnits; }
    public double getMaxUnits() { return maxUnits; }
    public double getRate() { return rate; }
    
    public double calculateSlabCharges(double consumed) {
        if (consumed <= minUnits) return 0.0;
        double unitsInSlab = Math.min(consumed, maxUnits) - minUnits;
        return Math.max(0.0, unitsInSlab * rate);
    }
}`
  },
  {
    name: 'Bill.java',
    description: 'Encapsulates the calculation engine for meter readings, processing tiered rates, static charges, and active taxation.',
    code: `package com.billing;

import java.time.LocalDate;
import java.util.List;

public class Bill {
    private String id;
    private String consumerId;
    private String consumerName;
    private String billingMonth;
    private double prevReading;
    private double currReading;
    private double unitsConsumed;
    private double slabAmount;
    private double fixedCharges;
    private double taxAmount;
    private double totalAmount;
    private LocalDate dueDate;
    private boolean isPaid;

    public Bill(String id, Consumer consumer, String billingMonth, 
                double prevReading, double currReading, List<TariffSlab> slabs) {
        this.id = id;
        this.consumerId = consumer.getId();
        this.consumerName = consumer.getName();
        this.billingMonth = billingMonth;
        this.prevReading = prevReading;
        this.currReading = currReading;
        
        this.unitsConsumed = Math.max(0.0, currReading - prevReading);
        this.fixedCharges = consumer.getConnectionType().getBaseCharge();
        
        // Compute slab amount dynamically through custom multi-tier calculation
        this.slabAmount = 0.0;
        for (TariffSlab slab : slabs) {
            this.slabAmount += slab.calculateSlabCharges(this.unitsConsumed);
        }
        
        double taxableAmount = this.slabAmount + this.fixedCharges;
        this.taxAmount = taxableAmount * consumer.getConnectionType().getTaxRate();
        this.totalAmount = taxableAmount + this.taxAmount;
        
        this.dueDate = LocalDate.now().plusDays(15);
        this.isPaid = false;
    }

    // Business Methods
    public void markAsPaid() { this.isPaid = true; }

    public String getId() { return id; }
    public String getConsumerId() { return consumerId; }
    public String getConsumerName() { return consumerName; }
    public String getBillingMonth() { return billingMonth; }
    public double getUnitsConsumed() { return unitsConsumed; }
    public double getTotalAmount() { return totalAmount; }
    public double getSlabAmount() { return slabAmount; }
    public double getFixedCharges() { return fixedCharges; }
    public double getTaxAmount() { return taxAmount; }
    public LocalDate getDueDate() { return dueDate; }
    public boolean isPaid() { return isPaid; }
}`
  },
  {
    name: 'ElectricityBillingSystem.java',
    description: 'Service orchestrator managing consumer registration, generating bills, and collecting payments.',
    code: `package com.billing;

import java.util.*;

public class ElectricityBillingSystem {
    private final Map<String, Consumer> consumers = new HashMap<>();
    private final List<Bill> bills = new ArrayList<>();
    private final Map<ConnectionType, List<TariffSlab>> tariffRegistry = new HashMap<>();

    public ElectricityBillingSystem() {
        initializeTariffs();
    }

    private void initializeTariffs() {
        // Domestic: 0-100 @ 0.15, 101-300 @ 0.22, 301+ @ 0.30
        tariffRegistry.put(ConnectionType.DOMESTIC, Arrays.asList(
            new TariffSlab(0, 100, 0.15),
            new TariffSlab(100, 300, 0.22),
            new TariffSlab(300, Double.MAX_VALUE, 0.30)
        ));

        // Commercial: 0-200 @ 0.24, 201-500 @ 0.32, 501+ @ 0.45
        tariffRegistry.put(ConnectionType.COMMERCIAL, Arrays.asList(
            new TariffSlab(0, 200, 0.24),
            new TariffSlab(200, 500, 0.32),
            new TariffSlab(500, Double.MAX_VALUE, 0.45)
        ));

        // Industrial: 0-1000 @ 0.35, 1001+ @ 0.50
        tariffRegistry.put(ConnectionType.INDUSTRIAL, Arrays.asList(
            new TariffSlab(0, 1000, 0.35),
            new TariffSlab(1000, Double.MAX_VALUE, 0.50)
        ));

        // Agricultural: Subsidized Flat rate 0.08
        tariffRegistry.put(ConnectionType.AGRICULTURAL, Collections.singletonList(
            new TariffSlab(0, Double.MAX_VALUE, 0.08)
        ));
    }

    public void registerConsumer(Consumer c) {
        consumers.put(c.getId(), c);
        System.out.println("-> [Success] Registered consumer: " + c.getName() + " [" + c.getId() + "]");
    }

    public Bill generateMonthlyBill(String billId, String consumerId, String month, double prev, double curr) {
        Consumer consumer = consumers.get(consumerId);
        if (consumer == null) {
            throw new IllegalArgumentException("Consumer not found: " + consumerId);
        }

        List<TariffSlab> slabs = tariffRegistry.get(consumer.getConnectionType());
        Bill bill = new Bill(billId, consumer, month, prev, curr, slabs);
        bills.add(bill);
        
        System.out.println("-> [Calculated] Auto-billed " + bill.getUnitsConsumed() + " units for " + consumer.getName());
        return bill;
    }

    public boolean recordPayment(String billId) {
        for (Bill b : bills) {
            if (b.getId().equalsIgnoreCase(billId)) {
                b.markAsPaid();
                System.out.println("-> [Payment] Success! Confirmed payment of $" + String.format("%.2f", b.getTotalAmount()) + " for bill: " + billId);
                return true;
            }
        }
        System.out.println("-> [Error] Bill not found ID: " + billId);
        return false;
    }

    public void showSystemReport() {
        System.out.println("========== CORE JAVA REPORT SYSTEM ==========");
        System.out.println("Registered Consumers Count: " + consumers.size());
        System.out.println("Generated Bills Count:      " + bills.size());
        
        double totalBilled = 0;
        double totalPaid = 0;
        for (Bill b : bills) {
            totalBilled += b.getTotalAmount();
            if (b.isPaid()) {
                totalPaid += b.getTotalAmount();
            }
        }
        System.out.println("Total Amount Billed:        $" + String.format("%.2f", totalBilled));
        System.out.println("Total Amount Collected:     $" + String.format("%.2f", totalPaid));
        System.out.println("=============================================");
    }
}`
  },
  {
    name: 'Main.java',
    description: 'Execution entry point, setting up the simulation database and processing several sample records.',
    code: `package com.billing;

public class Main {
    public static void main(String[] args) {
        System.out.println("=== INITIALIZING JAVA ELECTRICITY SYSTEM ===");
        ElectricityBillingSystem sys = new ElectricityBillingSystem();

        // 1. Create Consumers
        Consumer c1 = new Consumer("CON_1001", "Eleanor Vance", "eleanor@v.com", "555-0199", "MTR_89412", "742 Evergreen", ConnectionType.DOMESTIC);
        Consumer c2 = new Consumer("CON_1002", "Apex Market", "billing@apex.org", "555-0155", "MTR_90185", "102 Main St", ConnectionType.COMMERCIAL);

        sys.registerConsumer(c1);
        sys.registerConsumer(c2);

        System.out.println("\\n--- GENERATING MAY 2026 METER READINGS ---");
        // Eleanor: prev 4210, curr 4425 -> 215 units
        Bill b1 = sys.generateMonthlyBill("BIL_5001", "CON_1001", "May 2026", 4210, 4425);
        
        // Apex: prev 12450, curr 13120 -> 670 units
        Bill b2 = sys.generateMonthlyBill("BIL_5002", "CON_1002", "May 2026", 12450, 13120);

        System.out.println("\\n--- SIMULATING REAL-TIME TRANSACTION ---");
        sys.recordPayment("BIL_5001");

        System.out.println();
        sys.showSystemReport();
    }
}`
  }
];
